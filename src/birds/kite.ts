/**
 * The Kite — `KI`.
 *
 * ```text
 * KI x y = y
 * ```
 *
 * The Kestrel's mirror: ignore the FIRST argument and return the second.
 *
 * The name is literal — the Kite is `K I`, the Kestrel applied to the Identity
 * bird. It is also `C K`, the Cardinal applied to the Kestrel. Both derivations
 * are asserted in the law suite, since a bird that can be built two ways is a
 * bird whose implementation can be checked twice.
 */
export interface Kite {
  <A>(a: A): <B>(b: B) => B;
}

/**
 * Produce a function that ignores the first argument and returns the second.
 *
 * @example
 * ```ts
 * import { KI } from 'smullyan/birds'
 *
 * KI('discarded')(42) // 42
 * ```
 */
export const KI: Kite = () => (b) => b;

/** The Kite, by name. Identical to {@link KI}. */
export const kite: Kite = KI;
