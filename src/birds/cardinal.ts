/**
 * The Cardinal — `C`.
 *
 * ```text
 * C f x y = f y x
 * ```
 *
 * Argument flipping. The Cardinal takes a curried two-argument function and
 * returns one that expects its arguments in the opposite order.
 *
 * The Cardinal is its own inverse — `C (C f) ≡ f` — which is asserted as a
 * property in the law suite. Together with the Bluebird and the Warbler it
 * forms the BCKW basis, one of the classical alternatives to SKI.
 *
 * Note the generic scoping: `A` and `B` are both recoverable from `f`, so both
 * belong on the first call signature. Only the result type flows through
 * unchanged. Contrast the Bluebird, where `A` is invisible at the first call
 * and must be deferred to the second.
 */
export interface Cardinal {
  <A, B, C>(f: (a: A) => (b: B) => C): (b: B) => (a: A) => C;
}

/**
 * Flip the argument order of a curried binary function.
 *
 * @example
 * ```ts
 * import { C } from 'smullyan/birds'
 *
 * const concat = (a: string) => (b: string): string => a + b
 * concat('foo')('bar') // 'foobar'
 *
 * const flipped = C(concat)
 * flipped('foo')('bar') // 'barfoo'
 * ```
 */
export const C: Cardinal = (f) => (b) => (a) => f(a)(b);

/** The Cardinal, by name. Identical to {@link C}. */
export const cardinal: Cardinal = C;

/** Flip a curried binary function's argument order. Identical to {@link C}. */
export const flip: Cardinal = C;
