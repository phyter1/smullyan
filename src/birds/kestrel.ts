/**
 * The Kestrel — `K`.
 *
 * ```text
 * K x y = x
 * ```
 *
 * The constant function. `K` takes a value and returns a function that ignores
 * its argument and yields that value. In Smullyan's forest the Kestrel is the
 * bird whose response to any call is always the same.
 *
 * `K` is one half of the SKI basis, and `S K K ≡ I` — applying the Starling to
 * two Kestrels reconstructs the Identity bird. That derivation is asserted in
 * the law suite once the Starling lands.
 *
 * `B` is inferred at the SECOND call, so it is scoped there: nothing about the
 * discarded argument is knowable from `a` alone.
 */
export interface Kestrel {
  <A>(a: A): <B>(b: B) => A;
}

/**
 * Produce a function that ignores its argument and always returns `a`.
 *
 * @example
 * ```ts
 * import { K } from 'smullyan/birds'
 *
 * const always42 = K(42)
 * always42('ignored')  // 42
 * always42(null)       // 42
 * ```
 */
export const K: Kestrel = (a) => () => a;

/** The Kestrel, by name. Identical to {@link K}. */
export const kestrel: Kestrel = K;

/** The constant function. Identical to {@link K}. */
export const constant: Kestrel = K;
