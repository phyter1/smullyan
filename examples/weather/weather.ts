import type * as Reader from 'smullyan/reader';

/**
 * A small, complete program built from the library.
 *
 * It reads configuration from the environment, validates a city argument,
 * fetches a reading over HTTP with retries, and renders it — which is enough
 * to need every ADT for the reason it exists rather than as a demonstration:
 *
 *   Reader  the whole program is a function of its dependencies
 *   Result  configuration and input failures that must be reported
 *   Option  a value that is legitimately absent
 *   Task    the HTTP call, deferred so it can be retried
 *   agent   the retry policy, as data
 *
 * `fetchJson` and `sleep` are injected rather than imported. The library takes
 * no host APIs at all — `types: []`, so its published `.d.ts` has zero ambient
 * dependencies — and a program built from it inherits the payoff: this file
 * runs identically under a real clock and a fake one, with no network.
 */
import {
  backingOff,
  callingApi,
  exponentiallyFrom,
  isRetryable,
  millis,
  type Sleep,
  type Tool,
  type ToolError,
  upTo,
  whileFailing,
  withClock,
} from 'smullyan/agent';
import * as Option from 'smullyan/option';
import { pipe } from 'smullyan/pipe';
import * as Result from 'smullyan/result';

// --- The shape of the world -------------------------------------------------

export type Units = 'celsius' | 'fahrenheit';

/**
 * Environment variables as they actually arrive: present, absent, or explicitly
 * unset. `exactOptionalPropertyTypes` is on, so `?: string` would NOT accept an
 * explicit `undefined` — and `process.env.FOO` is exactly that.
 */
export interface Env {
  readonly WEATHER_API?: string | undefined;
  readonly UNITS?: string | undefined;
}

export interface Config {
  readonly endpoint: string;
  readonly units: Units;
}

/**
 * Everything the program needs from outside itself. Passing this as a `Reader`
 * environment rather than importing it is what makes the whole thing testable
 * without mocks.
 */
export interface Deps {
  readonly env: Env;
  readonly fetchJson: (url: string) => Promise<unknown>;
  readonly sleep: Sleep;
}

export interface Reading {
  readonly city: string;
  readonly tempC: number;
}

/**
 * A closed union, no base class. Every failure the program can report is listed
 * here, so the compiler can tell you when you have missed one.
 */
export type Failure =
  | { readonly kind: 'no-city' }
  | { readonly kind: 'missing-endpoint' }
  | { readonly kind: 'bad-units'; readonly got: string }
  | { readonly kind: 'call-failed'; readonly detail: ToolError }
  | { readonly kind: 'bad-payload' };

// --- Input and configuration ------------------------------------------------

/**
 * An absent argument and a blank one are the same failure, which is exactly
 * what `Option` is for: `fromNullable` handles the first, `filter` the second,
 * and `match` converts the absence into a reportable error at the boundary.
 */
export const parseCity = (raw: string | undefined): Result.Result<Failure, string> =>
  pipe(
    Option.fromNullable(raw),
    Option.filter((s: string) => s.trim().length > 0),
    Option.match<string, Result.Result<Failure, string>>(
      () => Result.err({ kind: 'no-city' }),
      (s) => Result.ok(s.trim()),
    ),
  );

const parseUnits = (raw: string | undefined): Result.Result<Failure, Units> => {
  const value = (raw ?? 'celsius').toLowerCase();
  return value === 'celsius' || value === 'fahrenheit'
    ? Result.ok(value)
    : Result.err({ kind: 'bad-units', got: value });
};

/**
 * `flatMap` unions the error types as it goes, so `Config` cannot be built from
 * a half-valid environment. The first failure short-circuits.
 */
export const parseConfig = (env: Env): Result.Result<Failure, Config> =>
  pipe(
    parseCity(env.WEATHER_API),
    Result.mapErr((): Failure => ({ kind: 'missing-endpoint' })),
    Result.flatMap((endpoint: string) =>
      pipe(
        parseUnits(env.UNITS),
        Result.map((units: Units) => ({ endpoint, units })),
      ),
    ),
  );

// --- The call ---------------------------------------------------------------

const asReading = (raw: unknown): Result.Result<Failure, Reading> => {
  if (typeof raw !== 'object' || raw === null) return Result.err({ kind: 'bad-payload' });
  const { city, tempC } = raw as Record<string, unknown>;
  return typeof city === 'string' && typeof tempC === 'number'
    ? Result.ok({ city, tempC })
    : Result.err({ kind: 'bad-payload' });
};

/**
 * The retry policy is plain data — no timers, no hidden clock. The clock is
 * bound once at the edge by `withClock`, and `whileFailing(isRetryable)` is
 * required rather than defaulted, because repeating an `InvalidArgs` burns
 * budget on a call that fails identically every time.
 *
 * This is the readable dialect of the agent API. It is also the part that
 * translates: the terse equivalents (`retry`, `exponential`, `fromPromise`) are
 * not in the registry, so a dialect cannot express them.
 */
const fetchReading = (deps: Deps, config: Config, city: string): Tool<unknown> => {
  const { retrying } = withClock(deps.sleep);
  return retrying(
    upTo(4).attempts,
    backingOff(exponentiallyFrom(millis(200))),
    whileFailing(isRetryable),
  )(
    callingApi(() => deps.fetchJson(`${config.endpoint}/weather?city=${encodeURIComponent(city)}`)),
  );
};

// --- Rendering --------------------------------------------------------------

const toFahrenheit = (c: number): number => c * 1.8 + 32;

export const render = (reading: Reading, units: Units): string => {
  const degrees = units === 'celsius' ? reading.tempC : toFahrenheit(reading.tempC);
  const symbol = units === 'celsius' ? 'C' : 'F';
  return `${reading.city}: ${degrees.toFixed(1)}°${symbol}`;
};

export const describe = (failure: Failure): string => {
  switch (failure.kind) {
    case 'no-city':
      return 'No city given. Usage: weather <city>';
    case 'missing-endpoint':
      return 'WEATHER_API is not set.';
    case 'bad-units':
      return `UNITS must be celsius or fahrenheit, not "${failure.got}".`;
    case 'call-failed':
      return `The weather service did not answer: ${failure.detail._tag}`;
    case 'bad-payload':
      return 'The weather service returned something unexpected.';
    default: {
      // Adding a variant to `Failure` without describing it is a COMPILE error
      // here, not a message that silently goes missing at runtime.
      const unhandled: never = failure;
      return unhandled;
    }
  }
};

// --- The program ------------------------------------------------------------

/**
 * A `Reader` over `Deps` returning a `Task`-shaped thunk: nothing runs until
 * both the dependencies and the call arrive. That is the whole point of the two
 * types together — `Reader` defers *what it needs*, `Task` defers *when*.
 */
export const report =
  (rawCity: string | undefined): Reader.Reader<Deps, () => Promise<string>> =>
  (deps) =>
  async () => {
    const plan = pipe(
      parseCity(rawCity),
      Result.flatMap((city: string) =>
        pipe(
          parseConfig(deps.env),
          Result.map((config: Config) => ({ city, config })),
        ),
      ),
    );

    if (Result.isErr(plan)) return describe(plan.error);

    const { city, config } = plan.value;
    const outcome = await fetchReading(deps, config, city)();

    return pipe(
      outcome,
      Result.mapErr((e: ToolError): Failure => ({ kind: 'call-failed', detail: e })),
      Result.flatMap(asReading),
      Result.match(describe, (reading: Reading) => render(reading, config.units)),
    );
  };
