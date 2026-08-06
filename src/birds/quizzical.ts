/**
 * The Quizzical bird — `Q2`.
 *
 * ```text
 * Q2 f g x = g (x f)
 * ```
 *
 * The Quixotic bird with the roles of the first two arguments exchanged:
 * `Q2 ≡ C Q1`, asserted in the law suite.
 */
export interface Quizzical {
  <F>(f: F): <R, S>(g: (r: R) => S) => (x: (f: F) => R) => S;
}

/** Apply `x` to `f`, then `g` to the result. */
export const Q2: Quizzical = (f) => (g) => (x) => g(x(f));

/** The Quizzical bird, by name. Identical to {@link Q2}. */
export const quizzical: Quizzical = Q2;
