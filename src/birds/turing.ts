import type { TuringSelf } from './self-application';

/**
 * The Turing bird — `U`.
 *
 * ```text
 * U x y = y (x x y)
 * ```
 *
 * Named for Alan Turing, who discovered the fixed-point combinator
 * `Θ = U U`. Applying the Turing bird to itself yields a fixed-point operator:
 * `Θ f = f (Θ f)`.
 *
 * The `x x` in the definition is self-application, so this needs the recursive
 * {@link TuringSelf} type.
 *
 * ## Why `U U` is not exported
 *
 * `Θ = U U` is correct in a lazy language and DIVERGES in an eager one:
 * evaluating `f (Θ f)` requires evaluating `Θ f` first, which requires
 * evaluating `Θ f` again, forever. JavaScript is eager, so `U(U)` type-checks
 * and immediately overflows the stack.
 *
 * The usable eager fixed point is the eta-expanded Z combinator — see the Sage
 * bird {@link Y}, which is what you actually want for recursion.
 */
export interface Turing {
  <A>(x: TuringSelf<A>): (y: (a: A) => A) => A;
}

/**
 * The Turing bird. Applied to itself it yields a fixed-point operator — which
 * diverges under eager evaluation. Use {@link Y} instead for real recursion.
 *
 * @example
 * ```ts
 * import { U } from 'smullyan/birds'
 * import type { TuringSelf } from 'smullyan/birds'
 *
 * // A self-applicable that bounds its own recursion.
 * const stop: TuringSelf<number> = () => () => 0
 * const inc = (n: number): number => n + 1
 *
 * U(stop)(inc) // 1
 * ```
 */
export const U: Turing = (x) => (y) => y(x(x)(y));

/** The Turing bird, by name. Identical to {@link U}. */
export const turing: Turing = U;
