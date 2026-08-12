import type { Result } from '../result/result';
import type { ToolError } from './error';
import type { Backoff, RetryPolicy, Sleep, Tool } from './tool';

import { isRetryable } from './error';
import {
  exponential,
  fixed,
  immediate,
  fromPromise,
  orElse,
  retry,
  timeout,
  withDefault,
} from './tool';

/**
 * The readable dialect.
 *
 * Everything here is a renaming of {@link ./tool} — no new behaviour — chosen so
 * that a call site states its own meaning and a reader (human or model) does not
 * have to fetch a signature to understand it.
 *
 * ## The problem this solves
 *
 * `timeout(30)` is ambiguous: milliseconds or seconds? `retry({ times: 4 })`
 * is ambiguous: is the first call one of the four? Those facts live in
 * documentation, so anyone writing code without that documentation loaded
 * guesses — plausibly, and often wrongly.
 *
 * Wrapping the scalar removes the guess. `seconds(30)` cannot be misread.
 * `upTo(4).attempts` settles the off-by-one at the call site. `whileFailing
 * (isTransient)` says which failures repeat without anyone looking up a default.
 *
 * ## Why the clock is bound once
 *
 * Both retrying and timing out need a delay capability, and threading a `sleep`
 * argument through every phrase would reintroduce exactly the noise this
 * dialect exists to remove. {@link withClock} binds it once at the edge and
 * returns the phrases that need it.
 *
 * @example
 * ```ts
 * const { retrying, givingUpAfter } = withClock(systemClock)
 *
 * const fetchIssue = pipe(
 *   callingApi(() => gh.issues.get(id)),
 *   retrying(
 *     whileFailing(isTransient),
 *     upTo(4).attempts,
 *     backingOff(exponentiallyFrom(millis(100))),
 *   ),
 *   givingUpAfter(seconds(10)),
 *   fallingBackTo(theValue('degraded')),
 * )
 * ```
 */

// --- Durations -------------------------------------------------------------

/** A length of time. Constructed by unit, so a call site cannot be misread. */
export interface Duration {
  readonly _tag: 'Duration';
  readonly ms: number;
}

/** A duration in milliseconds. */
export const millis: (n: number) => Duration = (n) => ({ _tag: 'Duration', ms: n });

/** A duration in seconds. */
export const seconds: (n: number) => Duration = (n) => ({ _tag: 'Duration', ms: n * 1000 });

/** A duration in minutes. */
export const minutes: (n: number) => Duration = (n) => ({ _tag: 'Duration', ms: n * 60_000 });

/** The duration in milliseconds. */
export const inMillis: (d: Duration) => number = (d) => d.ms;

// --- Attempt budgets -------------------------------------------------------

/** How many times a call may run in total, including the first. */
export interface Attempts {
  readonly _tag: 'Attempts';
  readonly total: number;
}

/**
 * An attempt budget, written as `upTo(4).attempts`.
 *
 * The trailing `.attempts` is the point: it makes the unit explicit and settles
 * the perennial off-by-one. Four attempts means one call and three retries.
 */
export const upTo: (n: number) => { readonly attempts: Attempts } = (n) => ({
  attempts: { _tag: 'Attempts', total: n },
});

/** A budget of exactly one attempt — never retry. */
export const onceOnly: Attempts = { _tag: 'Attempts', total: 1 };

// --- Backoff phrases -------------------------------------------------------

/** Wait the same duration before each retry. */
export const everyTime: (d: Duration) => Backoff = (d) => fixed(d.ms);

/** Retry with no delay at all. */
export const immediately: Backoff = immediate;

/** Wait a geometrically growing duration, doubling by default. */
export const exponentiallyFrom: (d: Duration, doubling?: number) => Backoff = (d, doubling = 2) =>
  exponential(d.ms, doubling);

/** Never wait longer than this, however the schedule grows. */
export const cappedAt: (d: Duration) => (b: Backoff) => Backoff = (d) => (b) =>
  b._tag === 'Exponential' ? exponential(b.baseMs, b.factor, d.ms) : b;

// --- Retry clauses ---------------------------------------------------------

interface WhileFailing {
  readonly _tag: 'WhileFailing';
  readonly predicate: (e: ToolError) => boolean;
}
interface Budget {
  readonly _tag: 'Budget';
  readonly attempts: Attempts;
}
interface BackingOff {
  readonly _tag: 'BackingOff';
  readonly backoff: Backoff;
}
interface IgnoringServerAdvice {
  readonly _tag: 'IgnoringServerAdvice';
}

/**
 * One clause of a retry policy.
 *
 * Clauses are order-independent and each names its own role, so a policy reads
 * as a sentence and cannot be assembled by positional accident.
 */
export type RetryClause = WhileFailing | Budget | BackingOff | IgnoringServerAdvice;

/** Retry only failures matching this predicate. Defaults to {@link isRetryable}. */
export const whileFailing: (predicate: (e: ToolError) => boolean) => RetryClause = (predicate) => ({
  _tag: 'WhileFailing',
  predicate,
});

/** Retry any failure the vocabulary considers transient. */
export const whileTransient: RetryClause = {
  _tag: 'WhileFailing',
  predicate: isRetryable,
};

/** Wait according to this schedule between attempts. */
export const backingOff: (backoff: Backoff) => RetryClause = (backoff) => ({
  _tag: 'BackingOff',
  backoff,
});

/**
 * Follow the local schedule even when the server sent a `Retry-After`.
 *
 * Rarely what you want — the server's advice is better information than a local
 * guess — which is why it must be asked for by name.
 */
export const ignoringServerAdvice: RetryClause = { _tag: 'IgnoringServerAdvice' };

/** An attempt budget, as a clause. `upTo(4).attempts` is accepted directly. */
export const within: (a: Attempts) => RetryClause = (attempts) => ({ _tag: 'Budget', attempts });

const isAttempts = (c: RetryClause | Attempts): c is Attempts => c._tag === 'Attempts';

const assemble = (clock: Sleep, clauses: ReadonlyArray<RetryClause | Attempts>): RetryPolicy => {
  let times = 1;
  let backoff: Backoff = immediate;
  let retryOn: (e: ToolError) => boolean = isRetryable;
  let respectRetryAfter = true;

  for (const c of clauses) {
    if (isAttempts(c)) {
      times = c.total;
      continue;
    }
    switch (c._tag) {
      case 'Budget':
        times = c.attempts.total;
        break;
      case 'WhileFailing':
        retryOn = c.predicate;
        break;
      case 'BackingOff':
        backoff = c.backoff;
        break;
      case 'IgnoringServerAdvice':
        respectRetryAfter = false;
        break;
    }
  }
  return { times, backoff, sleep: clock, retryOn, respectRetryAfter };
};

// --- Clock-bound phrases ---------------------------------------------------

/** The phrases that need a delay capability. */
export interface ClockBound {
  /**
   * Retry according to the given clauses, in any order.
   *
   * Accepts `upTo(n).attempts` directly as well as `within(...)`.
   */
  readonly retrying: (
    ...clauses: ReadonlyArray<RetryClause | Attempts>
  ) => <A>(tool: Tool<A>) => Tool<A>;
  /** Fail with a `Timeout` if the call has not answered within this duration. */
  readonly givingUpAfter: (d: Duration) => <A>(tool: Tool<A>) => Tool<A>;
}

/**
 * Bind a clock once, at the edge, and get the phrases that need it.
 *
 * ```ts
 * const systemClock: Sleep = (ms) => new Promise((r) => setTimeout(r, ms))
 * const { retrying, givingUpAfter } = withClock(systemClock)
 * ```
 *
 * In tests, pass a clock that records instead of waits — backoff schedules then
 * become assertions rather than delays.
 */
export const withClock: (clock: Sleep) => ClockBound = (clock) => ({
  retrying:
    (...clauses) =>
    <A>(tool: Tool<A>): Tool<A> =>
      retry(assemble(clock, clauses))(tool),
  givingUpAfter:
    (d) =>
    <A>(tool: Tool<A>): Tool<A> =>
      timeout(d.ms, clock)(tool),
});

// --- Clock-free phrases ----------------------------------------------------

/**
 * Lift an async call into a tool, classifying whatever it throws.
 *
 * ```ts
 * callingApi(() => gh.issues.get(id), asGithubError)
 * ```
 */
export const callingApi: <A>(
  invoke: () => Promise<A>,
  classify?: (e: unknown) => ToolError,
) => Tool<A> = (invoke, classify) =>
  classify === undefined ? fromPromise(invoke) : fromPromise(invoke, classify);

/** On failure, run this instead. */
export const fallingBackTo: <A>(alternative: () => Tool<A>) => (tool: Tool<A>) => Tool<A> =
  (alternative) => (tool) =>
    orElse<A_of<typeof alternative>>(() => alternative())(tool);

/** On failure, succeed with this value instead. */
export const orDefaultingTo: <A>(value: A) => (tool: Tool<A>) => Tool<A> = (value) =>
  withDefault(() => value);

/** A tool that always succeeds with this value. Reads well inside `fallingBackTo`. */
export const theValue: <A>(a: A) => () => Tool<A> = (a) => () => () =>
  Promise.resolve({ _tag: 'Ok', value: a } as Result<ToolError, typeof a>);

/** Helper alias used only to keep `fallingBackTo`'s inference readable. */
type A_of<F> = F extends () => Tool<infer A> ? A : never;
