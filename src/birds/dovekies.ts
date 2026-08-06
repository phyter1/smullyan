/**
 * The Dovekies — `D2`.
 *
 * ```text
 * D2 f g x h y = f (g x) (h y)
 * ```
 *
 * Transform BOTH arguments of a binary function, each by its own transformer.
 * Compare the Psi bird, which applies the SAME transformer to both — the
 * Dovekies is Psi's asymmetric cousin, and `D2 f g g ≡ Ψ f g` when the two
 * transformers coincide. The law suite asserts that.
 */
export interface Dovekies {
  <R, S, T>(
    f: (r: R) => (s: S) => T,
  ): <X>(g: (x: X) => R) => (x: X) => <Y>(h: (y: Y) => S) => (y: Y) => T;
}

/**
 * Combine two values, each transformed by its own function.
 *
 * @example
 * ```ts
 * import { D2 } from 'smullyan/birds'
 *
 * const add = (a: number) => (b: number): number => a + b
 * const len = (s: string): number => s.length
 * const inc = (n: number): number => n + 1
 *
 * D2(add)(len)('abc')(inc)(38) // 3 + 39
 * ```
 */
export const D2: Dovekies = (f) => (g) => (x) => (h) => (y) => f(g(x))(h(y));

/** The Dovekies, by name. Identical to {@link D2}. */
export const dovekies: Dovekies = D2;
