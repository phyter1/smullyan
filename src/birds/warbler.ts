/**
 * The Warbler — `W`.
 *
 * ```text
 * W f x = f x x
 * ```
 *
 * Argument duplication: hand the same value to a curried binary function twice.
 *
 * `W K ≡ I` — the Warbler applied to the Kestrel reconstructs the Identity
 * bird, since `K x x` discards the second copy. Asserted in the law suite.
 *
 * In monadic terms this is `join` for the Reader monad: a `Reader<R, Reader<R,
 * A>>` collapsed by supplying the same environment to both layers.
 */
export interface Warbler {
  <A, B>(f: (a: A) => (a2: A) => B): (a: A) => B;
}

/**
 * Apply a curried binary function to the same argument twice.
 *
 * @example
 * ```ts
 * import { W } from 'smullyan/birds'
 *
 * const add = (a: number) => (b: number): number => a + b
 * const double = W(add)
 * double(21) // 42
 * ```
 */
export const W: Warbler = (f) => (a) => f(a)(a);

/** The Warbler, by name. Identical to {@link W}. */
export const warbler: Warbler = W;

/** Apply a curried binary function to the same argument twice. Identical to {@link W}. */
export const duplicate: Warbler = W;
