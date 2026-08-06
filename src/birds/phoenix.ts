/**
 * The Phoenix — `Φ`.
 *
 * ```text
 * Φ f g h x = f (g x) (h x)
 * ```
 *
 * Feed one value through two different transformations, then combine the
 * results. Known elsewhere as `converge`, and as `liftA2` for the Reader monad.
 *
 * The classic use is a fold-free average: `Φ(divide)(sum)(length)`.
 *
 * `A` is deferred to the third call because neither `f` nor `g`'s position in
 * the first signature constrains it — it is first pinned when `h` arrives, and
 * `g` must agree with it.
 */
export interface Phoenix {
  <B, C, D>(f: (b: B) => (c: C) => D): <A>(g: (a: A) => B) => (h: (a: A) => C) => (a: A) => D;
}

/**
 * Apply two functions to one value and combine the results.
 *
 * @example
 * ```ts
 * import { phoenix } from 'smullyan/birds'
 *
 * const divide = (a: number) => (b: number): number => a / b
 * const sum = (ns: readonly number[]): number => ns.reduce((a, b) => a + b, 0)
 * const count = (ns: readonly number[]): number => ns.length
 *
 * const average = phoenix(divide)(sum)(count)
 * average([1, 2, 3, 4]) // 2.5
 * ```
 */
export const phoenix: Phoenix = (f) => (g) => (h) => (a) => f(g(a))(h(a));

/** The Phoenix, by symbol. Identical to {@link phoenix}. */
export const Phi: Phoenix = phoenix;

/** Converge two functions on one value. Identical to {@link phoenix}. */
export const converge: Phoenix = phoenix;
