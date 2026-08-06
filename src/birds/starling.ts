/**
 * The Starling — `S`.
 *
 * ```text
 * S f g x = f x (g x)
 * ```
 *
 * The substitution combinator, and the workhorse of the SKI basis: together
 * with the Kestrel it can express every other bird in the forest. `S K K ≡ I`
 * is the classic derivation, asserted in the law suite.
 *
 * In everyday terms this is `ap` for the Reader monad — both `f` and `g`
 * receive the same environment `x`, and `f`'s result is applied to `g`'s.
 *
 * All three type parameters are recoverable from `f` and `g` together, but `A`
 * appears in both, so it must be fixed by the first call for `g` to check
 * against it. Hence all three sit on the first signature.
 */
export interface Starling {
  <A, B, C>(f: (a: A) => (b: B) => C): (g: (a: A) => B) => (a: A) => C;
}

/**
 * Apply `f` and `g` to the same argument, then apply the results.
 *
 * @example
 * ```ts
 * import { S } from 'smullyan/birds'
 *
 * const add = (a: number) => (b: number): number => a + b
 * const inc = (n: number): number => n + 1
 *
 * // n + (n + 1)
 * const addToSuccessor = S(add)(inc)
 * addToSuccessor(20) // 41
 * ```
 */
export const S: Starling = (f) => (g) => (a) => f(a)(g(a));

/** The Starling, by name. Identical to {@link S}. */
export const starling: Starling = S;

/** Reader applicative application. Identical to {@link S}. */
export const ap: Starling = S;
