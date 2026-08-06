/**
 * The Dickcissel — `D1`.
 *
 * ```text
 * D1 f x y g z = f x y (g z)
 * ```
 *
 * The Dove one argument deeper: apply a curried TERNARY function, transforming
 * only its third argument.
 */
export interface Dickcissel {
  <X, Y, R, S>(
    f: (x: X) => (y: Y) => (r: R) => S,
  ): (x: X) => (y: Y) => <Z>(g: (z: Z) => R) => (z: Z) => S;
}

/** Apply a ternary function with its third argument pre-processed. */
export const D1: Dickcissel = (f) => (x) => (y) => (g) => (z) => f(x)(y)(g(z));

/** The Dickcissel, by name. Identical to {@link D1}. */
export const dickcissel: Dickcissel = D1;
