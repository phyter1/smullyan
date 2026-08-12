import type { Result } from '../result/result';
import type { TaskResult } from '../task/task';
import type { ToolError } from './error';

import { isSome } from '../option/option';
import { err, isErr, isOk, ok } from '../result/result';

import { fromThrown, suggestedDelayMs, timedOut } from './error';

/**
 * A tool call: an asynchronous operation that has not started yet and reports
 * failure in its type.
 *
 * ```ts
 * type Tool<A> = () => Promise<Result<ToolError, A>>
 * ```
 *
 * The thunk is what makes retry and timeout possible at all. A `Promise` has
 * already started and has cached its outcome, so it cannot be re-run; a `Tool`
 * is a *description* of a call, and every combinator here is just a way of
 * describing a different call in terms of it.
 *
 * ## The clock is injected
 *
 * `setTimeout` is a host API, not an ECMAScript one, and this library
 * guarantees its published declarations carry no ambient dependency. So
 * anything that waits takes a {@link Sleep} rather than reaching for a global.
 *
 * That constraint turned out to be a feature. Backoff schedules are pure data
 * and a fake clock makes them testable exactly, with no wall-clock waiting:
 *
 * ```ts
 * const waits: number[] = []
 * const fake: Sleep = async (ms) => { waits.push(ms) }
 * await retry({ times: 3, backoff: exponential(100), sleep: fake, retryOn }) (t)()
 * // waits === [100, 200]  — asserted, not slept through
 * ```
 */
export type Tool<A> = TaskResult<ToolError, A>;

/**
 * A delay capability.
 *
 * Supply your host's timer once, at the edge:
 *
 * ```ts
 * const sleep: Sleep = (ms) => new Promise((r) => setTimeout(r, ms))
 * ```
 */
export type Sleep = (ms: number) => Promise<void>;

// --- Backoff ---------------------------------------------------------------

/** Wait the same amount before every retry. */
export interface Fixed {
  readonly _tag: 'Fixed';
  readonly ms: number;
}

/** Wait `baseMs * factor^n`, optionally capped. */
export interface Exponential {
  readonly _tag: 'Exponential';
  readonly baseMs: number;
  readonly factor: number;
  readonly maxMs?: number;
}

/** Retry immediately. */
export interface Immediate {
  readonly _tag: 'Immediate';
}

/**
 * A backoff schedule, as data.
 *
 * Data rather than a closure so a policy can be logged, persisted alongside a
 * durable run, and shown to a model that is deciding whether to keep waiting.
 */
export type Backoff = Fixed | Exponential | Immediate;

/** Retry with no delay. */
export const immediate: Backoff = { _tag: 'Immediate' };

/** Retry after a constant delay. */
export const fixed: (ms: number) => Backoff = (ms) => ({ _tag: 'Fixed', ms });

/** Retry after a geometrically growing delay. */
export const exponential: (baseMs: number, factor?: number, maxMs?: number) => Backoff = (
  baseMs,
  factor = 2,
  maxMs,
) =>
  maxMs === undefined
    ? { _tag: 'Exponential', baseMs, factor }
    : { _tag: 'Exponential', baseMs, factor, maxMs };

/**
 * The delay before attempt `n`, zero-indexed — `delayFor(b, 0)` precedes the
 * FIRST retry, not the first call.
 *
 * Pure, so a schedule can be asserted without running anything.
 */
export const delayFor: (backoff: Backoff, attempt: number) => number = (backoff, attempt) => {
  // Assign-then-return: exhaustiveness stays a compile error via definite
  // assignment, with no unreachable arm that no test could ever cover.
  let ms: number;
  switch (backoff._tag) {
    case 'Immediate':
      ms = 0;
      break;
    case 'Fixed':
      ms = backoff.ms;
      break;
    case 'Exponential': {
      const raw = backoff.baseMs * backoff.factor ** attempt;
      ms = backoff.maxMs === undefined ? raw : Math.min(raw, backoff.maxMs);
      break;
    }
  }
  return ms;
};

// --- Retry -----------------------------------------------------------------

/** How to retry, as data. */
export interface RetryPolicy {
  /** Total attempts, INCLUDING the first. `times: 1` never retries. */
  readonly times: number;
  readonly backoff: Backoff;
  readonly sleep: Sleep;
  /**
   * Which failures are worth repeating. Required, not defaulted: retrying an
   * `InvalidArgs` is always wrong, and a silent default would hide that.
   * {@link isRetryable} is the sensible choice for {@link ToolError}.
   */
  readonly retryOn: (e: ToolError) => boolean;
  /**
   * Prefer the delay the error itself advises over the backoff schedule.
   * Only `RateLimited` carries one. Defaults to true — a server's `Retry-After`
   * is better information than any local guess.
   */
  readonly respectRetryAfter?: boolean;
}

/**
 * Retry a tool call according to a policy.
 *
 * Stops at the first success, the first non-retryable failure, or when the
 * attempt budget is spent — whichever comes first. The failure returned is
 * always the LAST one seen, so the caller sees why it finally gave up rather
 * than why it first stumbled.
 *
 * @example
 * ```ts
 * const sleep: Sleep = (ms) => new Promise((r) => setTimeout(r, ms))
 *
 * const resilient = retry({
 *   times: 4,
 *   backoff: exponential(200, 2, 5_000),
 *   sleep,
 *   retryOn: isRetryable,
 * })(fetchIssue)
 * ```
 */
export const retry: (policy: RetryPolicy) => <A>(tool: Tool<A>) => Tool<A> =
  (policy) =>
  <A>(tool: Tool<A>): Tool<A> =>
  async () => {
    const attempts = Math.max(1, policy.times);
    let last: Result<ToolError, A> = err(fromThrown('retry: no attempts were made'));

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      // Sequential by definition — each attempt exists only because the
      // previous one failed, so there is nothing to run concurrently.
      // oxlint-disable-next-line eslint/no-await-in-loop
      last = await tool();
      if (isOk(last)) return last;
      if (!policy.retryOn(last.error)) return last;

      // Only wait when another attempt will follow. Letting the loop fall out
      // on the final failure — rather than returning from inside it — is what
      // makes the trailing `return last` the real budget-exhausted path rather
      // than dead code no test could reach.
      if (attempt < attempts - 1) {
        const advised = suggestedDelayMs(last.error);
        const useAdvice = policy.respectRetryAfter !== false && isSome(advised);
        const waitMs =
          useAdvice && isSome(advised) ? advised.value : delayFor(policy.backoff, attempt);
        if (waitMs > 0) {
          // oxlint-disable-next-line eslint/no-await-in-loop
          await policy.sleep(waitMs);
        }
      }
    }
    return last;
  };

// --- Timeout ---------------------------------------------------------------

/**
 * Fail with {@link Timeout} if the call has not settled within `ms`.
 *
 * The underlying work is NOT cancelled — JavaScript has no general mechanism to
 * do so, and pretending otherwise would be a lie. It races the call against the
 * clock and reports which won. If cancellation matters, the tool itself must
 * accept an `AbortSignal`; this bounds how long you *wait*, not how long the
 * work *runs*.
 */
export const timeout: (ms: number, sleep: Sleep) => <A>(tool: Tool<A>) => Tool<A> =
  (ms, sleep) =>
  <A>(tool: Tool<A>): Tool<A> =>
  () => {
    const expired: Result<ToolError, A> = err(timedOut(ms));
    return Promise.race([tool(), sleep(ms).then(() => expired)]);
  };

// --- Recovery --------------------------------------------------------------

/** Fall back to another tool call on failure. */
export const orElse: <A>(alternative: (e: ToolError) => Tool<A>) => (tool: Tool<A>) => Tool<A> =
  (alternative) => (tool) => async () => {
    const r = await tool();
    return isErr(r) ? alternative(r.error)() : r;
  };

/** Supply a value on failure, ending the failure channel. */
export const withDefault: <A>(onError: (e: ToolError) => A) => (tool: Tool<A>) => Tool<A> =
  (onError) => (tool) => async () => {
    const r = await tool();
    return isErr(r) ? ok(onError(r.error)) : r;
  };

// --- Construction ----------------------------------------------------------

/** A tool call that always succeeds with `a`. */
export const succeed: <A>(a: A) => Tool<A> = (a) => () => Promise.resolve(ok(a));

/** A tool call that always fails with `e`. */
export const fail: <A>(e: ToolError) => Tool<A> = (e) => () => Promise.resolve(err(e));

/**
 * Lift a promise-returning function, classifying anything it throws.
 *
 * The boundary where an ordinary async API becomes a `Tool`. Pass `classify` to
 * map your client's failures onto the vocabulary — an HTTP 429 to
 * `rateLimited`, a 404 to `notFound` — so the model receives something it can
 * act on rather than a stringified exception.
 */
export const fromPromise: <A>(
  f: () => Promise<A>,
  classify?: (e: unknown) => ToolError,
) => Tool<A> =
  (f, classify = fromThrown) =>
  async () => {
    try {
      return ok(await f());
    } catch (e) {
      return err(classify(e));
    }
  };

/** Apply a function to a successful result. */
export const map: <A, B>(f: (a: A) => B) => (tool: Tool<A>) => Tool<B> =
  (f) => (tool) => async () => {
    const r = await tool();
    return isOk(r) ? ok(f(r.value)) : r;
  };

/** Chain another tool call onto a successful result. */
export const flatMap: <A, B>(f: (a: A) => Tool<B>) => (tool: Tool<A>) => Tool<B> =
  (f) => (tool) => async () => {
    const r = await tool();
    return isOk(r) ? f(r.value)() : r;
  };
