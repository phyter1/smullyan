/**
 * The Quacky bird — `Q4`.
 *
 * ```text
 * Q4 f g x = x (g f)
 * ```
 *
 * The Quirky bird with its first two arguments exchanged: `Q4 ≡ C Q3`,
 * asserted in the law suite. It is also the Thrush iterated twice — the value
 * arrives first and each subsequent argument consumes what came before.
 */
export interface Quacky {
  <F>(f: F): <R>(g: (f: F) => R) => <S>(x: (r: R) => S) => S;
}

/** Apply `g` to `f`, then `x` to the result. */
export const Q4: Quacky = (f) => (g) => (x) => x(g(f));

/** The Quacky bird, by name. Identical to {@link Q4}. */
export const quacky: Quacky = Q4;
