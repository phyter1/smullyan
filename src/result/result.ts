/**
 * `Result<E, A>` — a computation that either succeeded with `A` or failed
 * with `E`.
 *
 * ## Why the error type comes first
 *
 * `Result<E, A>`, not `Result<A, E>`. Type parameters in TypeScript are applied
 * left to right, so putting `E` first is what makes `Result<ParseError, _>`
 * usable as a partially-applied type in an alias:
 *
 * ```ts
 * type Parsed<A> = Result<ParseError, A>
 * ```
 *
 * The cost is that the common case reads "backwards" relative to `Promise<A>`.
 * That is the standard trade in fp-ts's `Either<E, A>` and Rust's
 * `Result<T, E>` chose the opposite; this library follows the former because
 * partial application is the more useful property in a type system without
 * higher-kinded types.
 *
 * ## Why `Err` carries a bare `E`
 *
 * `Err<E>` holds whatever you put in it — a string, an enum, an `Error`, a
 * tagged union of your own. It does NOT impose an error base class or a
 * `cause` chain.
 *
 * The reasoning: the moment this module defines an error class, every consumer
 * inherits its opinion about error identity, serialisation and stack capture.
 * Domain errors are usually best modelled as plain discriminated unions, which
 * a bare `E` supports directly. If you want `Error` semantics, use
 * `Result<Error, A>` and nothing is lost.
 *
 * The one place this shows is {@link fromThrowable}, where JavaScript hands us
 * an `unknown` — see the note there.
 *
 * ## Generic scoping
 *
 * Every combinator here scopes `E` to the call that SUPPLIES it, exactly as the
 * birds do (see `birds/bluebird.ts`). Writing `map` as
 * `<E, A, B>(f: (a: A) => B) => (fa: Result<E, A>) => Result<E, B>` compiles
 * and is WRONG: `E` appears nowhere in `f`, so it defaults to `unknown` and the
 * error type is silently discarded.
 *
 * That failure is invisible without a type test, because `Result<E, A>` is
 * COVARIANT in `E` — `Result<MyError, A>` is assignable to
 * `Result<unknown, A>`, so every call still compiles and every runtime test
 * still passes. `Reader<R, A>` is contravariant in `R` and therefore fails
 * loudly under the same mistake. Same bug, opposite volume.
 */

/** The success case. */
export interface Ok<A> {
  readonly _tag: 'Ok';
  readonly value: A;
}

/** The failure case. */
export interface Err<E> {
  readonly _tag: 'Err';
  readonly error: E;
}

/** A computation that either succeeded with `A` or failed with `E`. */
export type Result<E, A> = Ok<A> | Err<E>;

// --- Constructors ----------------------------------------------------------

/** Wrap a success. */
export const ok: <A>(value: A) => Result<never, A> = (value) => ({ _tag: 'Ok', value });

/** Wrap a failure. */
export const err: <E>(error: E) => Result<E, never> = (error) => ({ _tag: 'Err', error });

// --- Refinements -----------------------------------------------------------

/** Type guard narrowing to {@link Ok}. */
export const isOk: <E, A>(fa: Result<E, A>) => fa is Ok<A> = <E, A>(
  fa: Result<E, A>,
): fa is Ok<A> => fa._tag === 'Ok';

/** Type guard narrowing to {@link Err}. */
export const isErr: <E, A>(fa: Result<E, A>) => fa is Err<E> = <E, A>(
  fa: Result<E, A>,
): fa is Err<E> => fa._tag === 'Err';

// --- Interop ---------------------------------------------------------------

/**
 * Run a function that may throw, capturing the thrown value.
 *
 * JavaScript lets you `throw` anything, so what arrives in a `catch` is
 * genuinely `unknown` — not `Error`. Rather than lie about that with a cast,
 * this takes an `onThrow` mapper and makes you decide. That is the honest
 * signature, and it is why there is no zero-argument overload.
 *
 * @example
 * ```ts
 * const parsed = fromThrowable(
 *   () => JSON.parse(input) as unknown,
 *   (e) => (e instanceof Error ? e.message : 'unknown parse failure'),
 * )
 * ```
 */
export const fromThrowable: <E, A>(f: () => A, onThrow: (e: unknown) => E) => Result<E, A> = (
  f,
  onThrow,
) => {
  try {
    return ok(f());
  } catch (e) {
    return err(onThrow(e));
  }
};

/** Convert a nullable value, using `onNullish` for the failure case. */
export const fromNullable: <E, A>(
  onNullish: () => E,
) => (a: A | null | undefined) => Result<E, NonNullable<A>> = (onNullish) => (a) =>
  a === null || a === undefined ? err(onNullish()) : ok(a as NonNullable<typeof a>);

// --- Transformation --------------------------------------------------------

/** Apply a function to the success value. Failures pass through untouched. */
export const map: <A, B>(f: (a: A) => B) => <E>(fa: Result<E, A>) => Result<E, B> = (f) => (fa) =>
  isOk(fa) ? ok(f(fa.value)) : fa;

/** Apply a function to the failure value. Successes pass through untouched. */
export const mapErr: <E, F>(f: (e: E) => F) => <A>(fa: Result<E, A>) => Result<F, A> =
  (f) => (fa) =>
    isErr(fa) ? err(f(fa.error)) : fa;

/**
 * Chain a computation that may itself fail.
 *
 * The error types union rather than being forced to match, so a pipeline can
 * accumulate distinct failure modes without a common base type.
 */
export const flatMap: <A, F, B>(
  f: (a: A) => Result<F, B>,
) => <E>(fa: Result<E, A>) => Result<E | F, B> = (f) => (fa) => (isOk(fa) ? f(fa.value) : fa);

/** Apply a wrapped function to a wrapped value. Fails on the FIRST error. */
export const ap: <F, A, B>(
  ff: Result<F, (a: A) => B>,
) => <E>(fa: Result<E, A>) => Result<E | F, B> = (ff) => (fa) => {
  if (isErr(ff)) return ff;
  return isOk(fa) ? ok(ff.value(fa.value)) : fa;
};

/** Remove one level of nesting. */
export const flatten: <E, F, A>(fa: Result<E, Result<F, A>>) => Result<E | F, A> = (fa) =>
  isOk(fa) ? fa.value : fa;

// --- Elimination -----------------------------------------------------------

/** Exhaustively handle both cases. Failure branch first, as in `Option.match`. */
export const match: <E, A, B>(onErr: (e: E) => B, onOk: (a: A) => B) => (fa: Result<E, A>) => B =
  (onErr, onOk) => (fa) =>
    isOk(fa) ? onOk(fa.value) : onErr(fa.error);

/** Extract the success value, computing a fallback from the error. */
export const getOrElse: <E, A>(onErr: (e: E) => A) => (fa: Result<E, A>) => A = (onErr) => (fa) =>
  isOk(fa) ? fa.value : onErr(fa.error);

/** Fall back to another `Result` on failure. */
export const orElse: <E, F, A>(
  onErr: (e: E) => Result<F, A>,
) => (fa: Result<E, A>) => Result<F, A> = (onErr) => (fa) => (isOk(fa) ? fa : onErr(fa.error));

// --- Traversal -------------------------------------------------------------

/**
 * Turn a list of `Result`s into a `Result` of a list.
 *
 * Fails with the FIRST error and short-circuits. If you need every error, map
 * to a validation type that accumulates — this is the monadic sequence, and
 * short-circuiting is what makes it monadic.
 */
export const sequence: <E, A>(fas: ReadonlyArray<Result<E, A>>) => Result<E, ReadonlyArray<A>> = (
  fas,
) => {
  const out = [];
  for (const fa of fas) {
    if (isErr(fa)) return fa;
    out.push(fa.value);
  }
  return ok(out);
};

/** Map each element to a `Result`, then {@link sequence}. */
export const traverse: <E, A, B>(
  f: (a: A) => Result<E, B>,
) => (as: ReadonlyArray<A>) => Result<E, ReadonlyArray<B>> = (f) => (as) => sequence(as.map(f));
