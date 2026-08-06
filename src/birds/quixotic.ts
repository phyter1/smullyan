/**
 * The Quixotic bird — `Q1`.
 *
 * ```text
 * Q1 f g x = f (x g)
 * ```
 *
 * One of Smullyan's four Q-birds, which between them cover the permutations of
 * "apply one of three things to another and pass the result on". Here the THIRD
 * argument is the function and the second is its input.
 */
export interface Quixotic {
  <R, S>(f: (r: R) => S): <G>(g: G) => (x: (g: G) => R) => S;
}

/** Apply `x` to `g`, then `f` to the result. */
export const Q1: Quixotic = (f) => (g) => (x) => f(x(g));

/** The Quixotic bird, by name. Identical to {@link Q1}. */
export const quixotic: Quixotic = Q1;
