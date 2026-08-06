/**
 * The Vireo — `V`.
 *
 * ```text
 * V x y f = f x y
 * ```
 *
 * Hold two values, then hand them to a function. The Vireo is the classical
 * encoding of a PAIR in pure lambda calculus: `V a b` is the pair, and applying
 * it to `K` extracts the first element, to `KI` the second. Both extractions
 * are asserted in the law suite.
 */
export interface Vireo {
  <A>(a: A): <B>(b: B) => <C>(f: (a: A) => (b: B) => C) => C;
}

/**
 * Build a pair as a function awaiting its consumer.
 *
 * @example
 * ```ts
 * import { V, K, KI } from 'smullyan/birds'
 *
 * const pair = V(1)('two')
 * pair(K)  // 1
 * pair(KI) // 'two'
 * ```
 */
export const V: Vireo = (a) => (b) => (f) => f(a)(b);

/** The Vireo, by name. Identical to {@link V}. */
export const vireo: Vireo = V;

/** Church-encoded pair. Identical to {@link V}. */
export const pair: Vireo = V;
