/**
 * `Reader<R, A>` — a computation awaiting an environment `R`.
 *
 * ```ts
 * type Reader<R, A> = (r: R) => A
 * ```
 *
 * That is all it is: a function. The value of naming it is that a plain
 * function type has a `map`, a `flatMap` and an `ap`, and once you can see
 * that, dependency injection stops needing a framework.
 *
 * ## The birds were secretly about this all along
 *
 * The Reader monad's operations ARE combinators from the aviary, applied to
 * functions rather than to values:
 *
 * | Reader | Bird | Definition |
 * | --- | --- | --- |
 * | `map` | Bluebird `B` | `B f g x = f (g x)` |
 * | `ap` | Starling `S` | `S f g x = f x (g x)` |
 * | `flatMap` | Starling flipped | — |
 * | `join` | Warbler `W` | `W f x = f x x` |
 * | `of` | Kestrel `K` | `K x y = x` |
 *
 * The law suite asserts each of these equivalences directly, which is a
 * pleasingly strong check: the ADT and the combinators have to agree, and they
 * were written independently.
 *
 * ## Why `ask` and not just the identity function
 *
 * `ask` IS the identity function. Naming it documents intent at the call site —
 * "retrieve the environment" — rather than leaving a bare `id` for a reader to
 * decode.
 */
export type Reader<R, A> = (r: R) => A;

// --- Constructors ----------------------------------------------------------

/**
 * A reader that ignores the environment and returns a constant.
 *
 * This is the Kestrel: `of ≡ K`.
 */
export const of: <R, A>(a: A) => Reader<R, A> = (a) => () => a;

/**
 * Retrieve the environment itself.
 *
 * Extensionally the identity function; named for intent.
 */
export const ask: <R>() => Reader<R, R> = () => (r) => r;

/** Retrieve a projection of the environment. */
export const asks: <R, A>(f: (r: R) => A) => Reader<R, A> = (f) => f;

// --- Transformation --------------------------------------------------------

/**
 * Apply a function to the result.
 *
 * This is the Bluebird: `map ≡ B`.
 */
export const map: <A, B>(f: (a: A) => B) => <R>(fa: Reader<R, A>) => Reader<R, B> =
  (f) => (fa) => (r) =>
    f(fa(r));

/**
 * Chain a computation that also needs the environment.
 *
 * Both the outer and inner reader receive the SAME `r` — which is exactly what
 * makes this dependency injection rather than mere composition.
 */
export const flatMap: <R, A, B>(f: (a: A) => Reader<R, B>) => (fa: Reader<R, A>) => Reader<R, B> =
  (f) => (fa) => (r) =>
    f(fa(r))(r);

/**
 * Apply a wrapped function to a wrapped value.
 *
 * This is the Starling: `ap ≡ S`.
 */
export const ap: <R, A, B>(ff: Reader<R, (a: A) => B>) => (fa: Reader<R, A>) => Reader<R, B> =
  (ff) => (fa) => (r) =>
    ff(r)(fa(r));

/**
 * Remove one level of nesting.
 *
 * This is the Warbler: `flatten ≡ W`.
 */
export const flatten: <R, A>(ffa: Reader<R, Reader<R, A>>) => Reader<R, A> = (ffa) => (r) =>
  ffa(r)(r);

// --- Environment manipulation ----------------------------------------------

/**
 * Run a reader in a DERIVED environment.
 *
 * The contravariant direction: `local` maps the environment BACKWARDS, letting
 * a component that needs a small environment run inside a larger one.
 *
 * @example
 * ```ts
 * type App = { readonly db: Db; readonly log: Logger }
 * const withDb: Reader<Db, string> = (db) => db.name
 *
 * const inApp: Reader<App, string> = local((app: App) => app.db)(withDb)
 * ```
 */
export const local: <R, S>(f: (s: S) => R) => <A>(fa: Reader<R, A>) => Reader<S, A> =
  (f) => (fa) => (s) =>
    fa(f(s));

// --- Running ---------------------------------------------------------------

/** Supply the environment and get the result. */
export const run: <R>(r: R) => <A>(fa: Reader<R, A>) => A = (r) => (fa) => fa(r);
