/**
 * The Psi bird — `Ψ`.
 *
 * ```text
 * Ψ f g x y = f (g x) (g y)
 * ```
 *
 * Apply the same transformation to two values, then combine them. This is
 * Haskell's `on` and Ramda's `useWith` with a single shared transformer, and it
 * is the bird behind almost every comparator you have ever written:
 * `sortBy(Ψ(subtract)(prop('age')))`.
 */
export interface Psi {
  <B, C>(f: (b1: B) => (b2: B) => C): <A>(g: (a: A) => B) => (a1: A) => (a2: A) => C;
}

/**
 * Combine two values after mapping both through the same function.
 *
 * @example
 * ```ts
 * import { psi } from 'smullyan/birds'
 *
 * const compare = (a: number) => (b: number): number => a - b
 * const len = (s: string): number => s.length
 *
 * const byLength = psi(compare)(len)
 * byLength('aaa')('a') // 2
 * ```
 */
export const psi: Psi = (f) => (g) => (a1) => (a2) => f(g(a1))(g(a2));

/** The Psi bird, by symbol. Identical to {@link psi}. */
export const P: Psi = psi;

/** Combine two values on a shared projection. Identical to {@link psi}. */
export const on: Psi = psi;
