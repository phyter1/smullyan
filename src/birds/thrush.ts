/**
 * The Thrush — `T`.
 *
 * ```text
 * T x f = f x
 * ```
 *
 * Reversed application: take a value, then take a function, then apply it. The
 * Thrush is `C I` — the Cardinal applied to the Idiot — which the law suite
 * asserts.
 *
 * This is the one-argument `pipe`, and the reason `smullyan/pipe` exists: a
 * variadic `pipe` is just the Thrush iterated.
 */
export interface Thrush {
  <A>(a: A): <B>(f: (a: A) => B) => B;
}

/**
 * Apply a function to a value, value first.
 *
 * @example
 * ```ts
 * import { T } from 'smullyan/birds'
 *
 * T(41)((n: number) => n + 1) // 42
 * ```
 */
export const T: Thrush = (a) => (f) => f(a);

/** The Thrush, by name. Identical to {@link T}. */
export const thrush: Thrush = T;

/** Apply a function to a value, value first. Identical to {@link T}. */
export const applyTo: Thrush = T;
