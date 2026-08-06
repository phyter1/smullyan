/**
 * The Hummingbird — `H`.
 *
 * ```text
 * H f x y = f x y x
 * ```
 *
 * Supply the first argument twice, once at each end. The Hummingbird is the
 * Warbler's three-argument relative — where `W` duplicates into adjacent
 * positions, `H` duplicates across a gap.
 */
export interface Hummingbird {
  <A, B, C>(f: (a: A) => (b: B) => (a2: A) => C): (a: A) => (b: B) => C;
}

/**
 * Apply a ternary function with its first argument reused as the third.
 *
 * @example
 * ```ts
 * import { H } from 'smullyan/birds'
 *
 * const between = (a: number) => (b: number) => (c: number): string =>
 *   `${a}-${b}-${c}`
 *
 * H(between)(1)(2) // '1-2-1'
 * ```
 */
export const H: Hummingbird = (f) => (a) => (b) => f(a)(b)(a);

/** The Hummingbird, by name. Identical to {@link H}. */
export const hummingbird: Hummingbird = H;
