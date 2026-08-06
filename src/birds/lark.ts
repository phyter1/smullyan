import type { SelfApplicable } from './self-application';

/**
 * The Lark — `L`.
 *
 * ```text
 * L x y = x (y y)
 * ```
 *
 * Apply `y` to itself, then hand the result to `x`. The Lark is the
 * Mockingbird composed with the Bluebird — `L ≡ B M` — and like the
 * Mockingbird it requires a self-referential type.
 *
 * `L L L` is another non-terminating term. As with the Mockingbird, the Lark is
 * useful when the self-applied argument bounds its own recursion.
 */
export interface Lark {
  <A, B>(f: (a: A) => B): (y: SelfApplicable<A>) => B;
}

/**
 * Self-apply the second argument, then pass the result to the first.
 *
 * @example
 * ```ts
 * import { L } from 'smullyan/birds'
 * import type { SelfApplicable } from 'smullyan/birds'
 *
 * const five: SelfApplicable<number> = () => 5
 * const inc = (n: number): number => n + 1
 *
 * L(inc)(five) // 6
 * ```
 */
export const L: Lark = (f) => (y) => f(y(y));

/** The Lark, by name. Identical to {@link L}. */
export const lark: Lark = L;
