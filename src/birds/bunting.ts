/**
 * The Bunting — `B2`.
 *
 * ```text
 * B2 f g x y z = f (g x y z)
 * ```
 *
 * The Blackbird's bigger sibling: compose a unary function onto a curried
 * TERNARY one. Where `B` reaches over one argument and `B1` over two, `B2`
 * reaches over three.
 */
export interface Bunting {
  <D, E>(
    f: (d: D) => E,
  ): <A, B, C>(g: (a: A) => (b: B) => (c: C) => D) => (a: A) => (b: B) => (c: C) => E;
}

/**
 * Compose a unary function onto a curried ternary one.
 *
 * @example
 * ```ts
 * import { B2 } from 'smullyan/birds'
 *
 * const add3 = (a: number) => (b: number) => (c: number): number => a + b + c
 * const show = (n: number): string => String(n)
 *
 * B2(show)(add3)(20)(20)(2) // '42'
 * ```
 */
export const B2: Bunting = (f) => (g) => (a) => (b) => (c) => f(g(a)(b)(c));

/** The Bunting, by name. Identical to {@link B2}. */
export const bunting: Bunting = B2;
