/**
 * The Idiot — `I`.
 *
 * ```text
 * I x = x
 * ```
 *
 * The identity function, and the simplest bird in the forest. Smullyan calls it
 * the Idiot because it merely echoes back whatever it is called with.
 *
 * `I` is derivable rather than primitive: `S K K ≡ I` and `W K ≡ I`. Both are
 * asserted in the law suite, which is the cheapest possible check that the
 * Starling, Kestrel and Warbler all agree with each other.
 */
export interface Idiot {
  <A>(a: A): A;
}

/**
 * Return the argument unchanged.
 *
 * @example
 * ```ts
 * import { I } from 'smullyan/birds'
 *
 * I(42)      // 42
 * I('same')  // 'same'
 * ```
 */
export const I: Idiot = (a) => a;

/** The Idiot, by name. Identical to {@link I}. */
export const idiot: Idiot = I;

/** The identity function. Identical to {@link I}. */
export const identity: Idiot = I;
