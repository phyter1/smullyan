/**
 * The Jay — `J`.
 *
 * ```text
 * J f x y z = f x (f z y)
 * ```
 *
 * The Jay uses the same function twice, nesting one application inside the
 * other. Note the type constraint this forces: `f`'s result must be assignable
 * to `f`'s own second parameter, since `f z y` is fed back in as an argument.
 * That makes `f` an accumulating operation — exactly the shape of a fold step.
 */
export interface Jay {
  <A, B>(f: (a: A) => (b: B) => B): (x: A) => (y: B) => (z: A) => B;
}

/**
 * Apply a binary accumulating function twice, nested.
 *
 * @example
 * ```ts
 * import { J } from 'smullyan/birds'
 *
 * const cat = (a: string) => (b: string): string => a + b
 * J(cat)('a')('b')('c') // 'a' + ('c' + 'b') = 'acb'
 * ```
 */
export const J: Jay = (f) => (x) => (y) => (z) => f(x)(f(z)(y));

/** The Jay, by name. Identical to {@link J}. */
export const jay: Jay = J;
