/**
 * The Cardinal once removed — `C*`.
 *
 * ```text
 * C* f x y z = f x z y
 * ```
 *
 * The Cardinal shifted one argument deeper: the first argument passes through
 * and the LAST TWO are exchanged. `C* ≡ B C`, asserted in the law suite. Like
 * the Cardinal, it is its own inverse.
 */
export interface CardinalOnceRemoved {
  <A, B, C, D>(f: (a: A) => (c: C) => (b: B) => D): (a: A) => (b: B) => (c: C) => D;
}

/**
 * Flip the last two arguments of a curried ternary function.
 *
 * @example
 * ```ts
 * import { CStar } from 'smullyan/birds'
 *
 * const triple = (a: string) => (b: string) => (c: string): string => a + b + c
 * CStar(triple)('x')('y')('z') // 'x' + 'z' + 'y'
 * ```
 */
export const CStar: CardinalOnceRemoved = (f) => (a) => (b) => (c) => f(a)(c)(b);

/** The Cardinal once removed, by name. Identical to {@link CStar}. */
export const cardinalOnceRemoved: CardinalOnceRemoved = CStar;
