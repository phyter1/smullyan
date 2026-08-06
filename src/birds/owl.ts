/**
 * The Owl — `O`.
 *
 * ```text
 * O f g = g (f g)
 * ```
 *
 * The Owl is grouped with the hard forest by tradition, but it is the odd one
 * out: **it is perfectly simply-typeable**. No self-application appears in its
 * definition — `f` is applied to `g`, and `g` to the result. The recursion
 * people associate with it comes from what you PASS it, not from the bird.
 *
 * `O ≡ S I`, asserted in the law suite. Feeding the Owl a self-applicative
 * argument is what produces fixed-point behaviour, which is why it keeps
 * company with the Mockingbird and the Sage.
 */
export interface Owl {
  <A, B>(f: (g: (a: A) => B) => A): (g: (a: A) => B) => B;
}

/**
 * Apply `f` to `g`, then `g` to the result.
 *
 * @example
 * ```ts
 * import { O } from 'smullyan/birds'
 *
 * const pick = (_g: (n: number) => string): number => 41
 * const show = (n: number): string => String(n)
 *
 * O(pick)(show) // '41'
 * ```
 */
export const O: Owl = (f) => (g) => g(f(g));

/** The Owl, by name. Identical to {@link O}. */
export const owl: Owl = O;
