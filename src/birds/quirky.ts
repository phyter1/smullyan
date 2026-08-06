/**
 * The Quirky bird — `Q3`.
 *
 * ```text
 * Q3 f g x = x (f g)
 * ```
 *
 * Apply the first argument to the second, then hand the result to the third.
 * The Quirky bird is the Queer bird with its arguments rotated.
 */
export interface Quirky {
  <G, R>(f: (g: G) => R): (g: G) => <S>(x: (r: R) => S) => S;
}

/** Apply `f` to `g`, then `x` to the result. */
export const Q3: Quirky = (f) => (g) => (x) => x(f(g));

/** The Quirky bird, by name. Identical to {@link Q3}. */
export const quirky: Quirky = Q3;
