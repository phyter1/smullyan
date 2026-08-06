/**
 * The Blackbird — `B1`.
 *
 * ```text
 * B1 f g x y = f (g x y)
 * ```
 *
 * Composition that reaches over a two-argument function. Where the Bluebird
 * composes onto a unary function, the Blackbird composes onto a binary one.
 *
 * The classical derivation is `B1 ≡ B B B`, and it holds at runtime — but it
 * is NOT expressible in TypeScript. Passing `B` to itself requires
 * instantiating a generic combinator at a polytype, i.e. higher-rank
 * polymorphism, which TypeScript does not have. Explicit type arguments do not
 * rescue it either; the compiler reports that "'B' could be instantiated with
 * an arbitrary type which could be unrelated to 'number'".
 *
 * That boundary is asserted as a compile-time fact in
 * `test/birds.negative.test-d.ts`, so if a future TypeScript release gains the
 * expressiveness, the test fails loudly and this note can be revisited. The
 * law suite asserts the rank-1 equivalent instead: `B1 f g x ≡ B f (g x)`.
 *
 * Useful whenever you want to post-process a binary operation without
 * rewrapping it — `B1(not)(equals)` is `notEquals`.
 */
export interface Blackbird {
  <C, D>(f: (c: C) => D): <A, B>(g: (a: A) => (b: B) => C) => (a: A) => (b: B) => D;
}

/**
 * Compose a unary function onto a curried binary one.
 *
 * @example
 * ```ts
 * import { B1 } from 'smullyan/birds'
 *
 * const add = (a: number) => (b: number): number => a + b
 * const show = (n: number): string => String(n)
 *
 * const addThenShow = B1(show)(add)
 * addThenShow(40)(2) // '42'
 * ```
 */
export const B1: Blackbird = (f) => (g) => (a) => (b) => f(g(a)(b));

/** The Blackbird, by name. Identical to {@link B1}. */
export const blackbird: Blackbird = B1;

/** Compose onto a binary function. Identical to {@link B1}. */
export const compose2: Blackbird = B1;
