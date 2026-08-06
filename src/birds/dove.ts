/**
 * The Dove — `D`.
 *
 * ```text
 * D f x g y = f x (g y)
 * ```
 *
 * Apply a binary function, transforming only the SECOND argument. `D ≡ B B`,
 * asserted in the law suite.
 */
export interface Dove {
  <X, R, S>(f: (x: X) => (r: R) => S): (x: X) => <Y>(g: (y: Y) => R) => (y: Y) => S;
}

/**
 * Apply a binary function with its second argument pre-processed.
 *
 * @example
 * ```ts
 * import { D } from 'smullyan/birds'
 *
 * const add = (a: number) => (b: number): number => a + b
 * const len = (s: string): number => s.length
 *
 * D(add)(39)(len)('abc') // 42
 * ```
 */
export const D: Dove = (f) => (x) => (g) => (y) => f(x)(g(y));

/** The Dove, by name. Identical to {@link D}. */
export const dove: Dove = D;
