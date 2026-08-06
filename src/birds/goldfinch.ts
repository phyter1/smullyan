/**
 * The Goldfinch — `G`.
 *
 * ```text
 * G f g x y = f y (g x)
 * ```
 *
 * Transform one argument, leave the other alone, and combine them crosswise.
 * The Goldfinch is `B B C` composed with itself in the sense that it both
 * flips and pre-processes — useful for comparators where only one side needs
 * projecting.
 */
export interface Goldfinch {
  <Y, R, S>(f: (y: Y) => (r: R) => S): <X>(g: (x: X) => R) => (x: X) => (y: Y) => S;
}

/**
 * Combine an untouched argument with a transformed one, crosswise.
 *
 * @example
 * ```ts
 * import { G } from 'smullyan/birds'
 *
 * const sub = (a: number) => (b: number): number => a - b
 * const len = (s: string): number => s.length
 *
 * G(sub)(len)('abc')(10) // 10 - 3
 * ```
 */
export const G: Goldfinch = (f) => (g) => (x) => (y) => f(y)(g(x));

/** The Goldfinch, by name. Identical to {@link G}. */
export const goldfinch: Goldfinch = G;
