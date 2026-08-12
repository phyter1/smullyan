/**
 * `smullyan/agent` — typed, serializable tool calls for agentic systems.
 *
 * Pure re-export barrel; implementations live in `error.ts` and `tool.ts` so
 * they are covered by the coverage gate. See the warning in `vitest.config.ts`.
 */
export {
  // The failure vocabulary
  type ToolError,
  type RateLimited,
  type InvalidArgs,
  type NotFound,
  type Timeout,
  type Unavailable,
  type Denied,
  type Unknown,
  rateLimited,
  invalidArgs,
  notFound,
  timedOut,
  unavailable,
  denied,
  unknownError,
  fromThrown,
  isRetryable,
  suggestedDelayMs,
  explain,
  parse,
} from './error';

export {
  // The call type and its capabilities
  type Tool,
  type Sleep,
  type Backoff,
  type Fixed,
  type Exponential,
  type Immediate,
  type RetryPolicy,
  immediate,
  fixed,
  exponential,
  delayFor,
  retry,
  timeout,
  orElse,
  withDefault,
  succeed,
  fail,
  fromPromise,
  map,
  flatMap,
} from './tool';

/**
 * The readable dialect — same behaviour, names that state their own meaning.
 *
 * Prefer these at call sites. `seconds(10)` cannot be misread as milliseconds;
 * `upTo(4).attempts` settles the off-by-one; `whileTransient` says which
 * failures repeat without anyone looking up a default.
 */
export {
  type Duration,
  type Attempts,
  type RetryClause,
  type ClockBound,
  millis,
  seconds,
  minutes,
  inMillis,
  upTo,
  onceOnly,
  everyTime,
  immediately,
  exponentiallyFrom,
  cappedAt,
  whileFailing,
  whileTransient,
  backingOff,
  ignoringServerAdvice,
  within,
  withClock,
  callingApi,
  fallingBackTo,
  orDefaultingTo,
  theValue,
} from './phrases';
