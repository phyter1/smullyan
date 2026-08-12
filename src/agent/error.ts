import type { Option } from '../option/option';

import { none, some } from '../option/option';

/**
 * A closed, serializable vocabulary of tool failures.
 *
 * ## Why this exists
 *
 * When a tool call fails inside an agent loop, the failure has to travel: back
 * through a tool-result envelope, into the model's context, often across a
 * process or network boundary, and frequently into durable state so a run can
 * be resumed. A thrown `Error` survives none of that — `JSON.stringify(new
 * Error('x'))` is `{}` — and a stringly-typed message gives the model nothing
 * to branch on.
 *
 * Every variant here is a plain object with a `_tag` and fields chosen so that
 * BOTH a program and a language model can act on them. `RateLimited` carries
 * how long to wait. `InvalidArgs` carries which argument path was wrong and
 * what arrived. `NotFound` carries what was searched for, so the model can try
 * a different query rather than repeat the same one.
 *
 * ## Closed on purpose
 *
 * The union is closed so `match` is exhaustive and adding a variant is a
 * compile error at every call site. {@link Unknown} is the escape hatch for
 * genuinely unclassifiable failures — it carries the original value as
 * `unknown` rather than pretending it was an `Error`.
 */

/** The tool was rate limited. `retryAfterMs` is the server's advice, when given. */
export interface RateLimited {
  readonly _tag: 'RateLimited';
  readonly retryAfterMs: number;
  readonly limit?: string;
}

/** Arguments failed validation before the tool ran. */
export interface InvalidArgs {
  readonly _tag: 'InvalidArgs';
  /** Dotted path to the offending argument, e.g. `"filters.since"`. */
  readonly path: string;
  readonly expected: string;
  readonly got: unknown;
}

/** The tool ran and the thing asked for does not exist. */
export interface NotFound {
  readonly _tag: 'NotFound';
  readonly searched: string;
  /** Near-misses worth trying instead, if the tool can suggest any. */
  readonly suggestions?: ReadonlyArray<string>;
}

/** The tool did not answer within its budget. */
export interface Timeout {
  readonly _tag: 'Timeout';
  readonly afterMs: number;
}

/** The tool exists but is temporarily unusable — upstream 5xx, cold start, outage. */
export interface Unavailable {
  readonly _tag: 'Unavailable';
  readonly reason: string;
  readonly status?: number;
}

/** The caller is not permitted to do this. Retrying will not help. */
export interface Denied {
  readonly _tag: 'Denied';
  readonly reason: string;
  /** The capability that was missing, when it can be named. */
  readonly required?: string;
}

/** Unclassifiable failure. Carries the original value without lying about its type. */
export interface Unknown {
  readonly _tag: 'Unknown';
  readonly message: string;
  readonly cause?: unknown;
}

/** Everything a tool call is allowed to fail with. */
export type ToolError =
  | RateLimited
  | InvalidArgs
  | NotFound
  | Timeout
  | Unavailable
  | Denied
  | Unknown;

// --- Constructors ----------------------------------------------------------

/** The tool was rate limited. */
export const rateLimited: (retryAfterMs: number, limit?: string) => ToolError = (
  retryAfterMs,
  limit,
) =>
  limit === undefined
    ? { _tag: 'RateLimited', retryAfterMs }
    : { _tag: 'RateLimited', retryAfterMs, limit };

/** Arguments failed validation. */
export const invalidArgs: (path: string, expected: string, got: unknown) => ToolError = (
  path,
  expected,
  got,
) => ({ _tag: 'InvalidArgs', path, expected, got });

/** The thing asked for does not exist. */
export const notFound: (searched: string, suggestions?: ReadonlyArray<string>) => ToolError = (
  searched,
  suggestions,
) =>
  suggestions === undefined
    ? { _tag: 'NotFound', searched }
    : { _tag: 'NotFound', searched, suggestions };

/** The tool exceeded its time budget. */
export const timedOut: (afterMs: number) => ToolError = (afterMs) => ({
  _tag: 'Timeout',
  afterMs,
});

/** The tool is temporarily unusable. */
export const unavailable: (reason: string, status?: number) => ToolError = (reason, status) =>
  status === undefined ? { _tag: 'Unavailable', reason } : { _tag: 'Unavailable', reason, status };

/** The caller lacks permission. */
export const denied: (reason: string, required?: string) => ToolError = (reason, required) =>
  required === undefined ? { _tag: 'Denied', reason } : { _tag: 'Denied', reason, required };

/** An unclassifiable failure. */
export const unknownError: (message: string, cause?: unknown) => ToolError = (message, cause) =>
  cause === undefined ? { _tag: 'Unknown', message } : { _tag: 'Unknown', message, cause };

/**
 * Classify a thrown value.
 *
 * The boundary between "something was thrown" and this vocabulary. Deliberately
 * conservative: anything it cannot confidently classify becomes {@link Unknown}
 * with the original value attached, rather than being guessed into a variant
 * that would change retry behaviour.
 */
export const fromThrown: (e: unknown) => ToolError = (e) => {
  if (e instanceof Error) return unknownError(e.message, e);
  if (typeof e === 'string') return unknownError(e);
  return unknownError('non-Error thrown', e);
};

// --- Interrogation ---------------------------------------------------------

/**
 * Which failures are worth repeating.
 *
 * A total `Record` rather than a switch, so adding a variant to {@link ToolError}
 * without deciding its retry behaviour is a COMPILE error — a missing key — not
 * a silent default.
 */
const RETRYABLE: Record<ToolError['_tag'], boolean> = {
  RateLimited: true,
  Timeout: true,
  Unavailable: true,
  // Unclassified: assume transient once, and let the retry budget bound it.
  Unknown: true,
  // Repeating these produces the identical failure and burns context.
  InvalidArgs: false,
  Denied: false,
  NotFound: false,
};

/**
 * Is retrying this failure meaningful?
 *
 * `InvalidArgs` and `Denied` are excluded: the same call will fail identically,
 * so retrying burns budget and, in an agent loop, burns context. The model
 * should change the call instead — which is exactly what those variants carry
 * enough information to do.
 */
export const isRetryable: (e: ToolError) => boolean = (e) => RETRYABLE[e._tag];

/**
 * How long the error itself says to wait, if it says anything.
 *
 * Only `RateLimited` carries server advice. Everything else defers to the
 * caller's backoff policy.
 */
export const suggestedDelayMs: (e: ToolError) => Option<number> = (e) =>
  e._tag === 'RateLimited' ? some(e.retryAfterMs) : none;

/**
 * A sentence written for a language model to read.
 *
 * Not a log line. Each message states what failed AND what to do differently,
 * because the consumer is a model deciding its next action. `NotFound` offers
 * suggestions; `InvalidArgs` names the path and what was expected; `Denied`
 * says explicitly not to retry.
 */
export const explain: (e: ToolError) => string = (e) => {
  // Assign-then-return rather than return-per-arm. Exhaustiveness is still a
  // COMPILE error — TypeScript's definite-assignment analysis reports `message`
  // as used-before-assigned if a variant is added without a case — but there is
  // no unreachable `default` arm, which could never be covered by a test.
  let message: string;
  switch (e._tag) {
    case 'RateLimited':
      message = `Rate limited${e.limit === undefined ? '' : ` on ${e.limit}`}. Wait ${String(e.retryAfterMs)}ms before trying again; do not change the arguments.`;
      break;
    case 'InvalidArgs':
      message = `Invalid argument at "${e.path}": expected ${e.expected}, got ${JSON.stringify(e.got)}. Fix the argument and call again — retrying unchanged will fail identically.`;
      break;
    case 'NotFound':
      message = `Not found: "${e.searched}".${
        e.suggestions === undefined || e.suggestions.length === 0
          ? ' Try a different query rather than repeating this one.'
          : ` Closest matches: ${e.suggestions.join(', ')}.`
      }`;
      break;
    case 'Timeout':
      message = `Timed out after ${String(e.afterMs)}ms. The tool may still be working; consider a narrower request.`;
      break;
    case 'Unavailable':
      message = `Temporarily unavailable${e.status === undefined ? '' : ` (status ${String(e.status)})`}: ${e.reason}. Safe to retry shortly.`;
      break;
    case 'Denied':
      message = `Permission denied: ${e.reason}.${e.required === undefined ? '' : ` Requires: ${e.required}.`} Do not retry; this needs a different approach or an escalation.`;
      break;
    case 'Unknown':
      message = `Unclassified failure: ${e.message}. Retry once; if it repeats, treat it as permanent.`;
      break;
  }
  return message;
};

// --- Round-tripping --------------------------------------------------------

const TAGS: ReadonlySet<string> = new Set<string>([
  'RateLimited',
  'InvalidArgs',
  'NotFound',
  'Timeout',
  'Unavailable',
  'Denied',
  'Unknown',
]);

/**
 * Validate an unknown value — typically JSON that came back over a wire — as a
 * {@link ToolError}.
 *
 * The whole point of this module is that errors cross boundaries, and anything
 * that crosses a boundary comes back as `unknown`. Returning `Option` rather
 * than casting keeps that honest: a malformed envelope is absence, not a
 * `ToolError`-shaped lie.
 */
export const parse: (u: unknown) => Option<ToolError> = (u) => {
  if (typeof u !== 'object' || u === null) return none;
  const tag: unknown = (u as { _tag?: unknown })._tag;
  if (typeof tag !== 'string') return none;
  if (!TAGS.has(tag)) return none;

  const has = (k: string, t: string): boolean => typeof (u as Record<string, unknown>)[k] === t;

  switch (tag) {
    case 'RateLimited':
      return has('retryAfterMs', 'number') ? some(u as ToolError) : none;
    case 'InvalidArgs':
      return has('path', 'string') && has('expected', 'string') ? some(u as ToolError) : none;
    case 'NotFound':
      return has('searched', 'string') ? some(u as ToolError) : none;
    case 'Timeout':
      return has('afterMs', 'number') ? some(u as ToolError) : none;
    case 'Unavailable':
      return has('reason', 'string') ? some(u as ToolError) : none;
    case 'Denied':
      return has('reason', 'string') ? some(u as ToolError) : none;
    default:
      return has('message', 'string') ? some(u as ToolError) : none;
  }
};
