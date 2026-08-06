/**
 * The Robin — `R`.
 *
 * ```text
 * R x f y = f y x
 * ```
 *
 * Take a value, then a binary function, then a second value — and apply the
 * function with the arguments in the opposite order to the one they arrived in.
 *
 * `R ≡ B B C`, and applying the Robin three times is the identity: `R (R (R f))
 * ≡ f`, since the Robin generates a cyclic permutation of three arguments.
 */
export interface Robin {
  <A>(a: A): <B, C>(f: (b: B) => (a: A) => C) => (b: B) => C;
}

/**
 * Apply a binary function to arguments supplied out of order.
 *
 * @example
 * ```ts
 * import { R } from 'smullyan/birds'
 *
 * const cat = (a: string) => (b: string): string => a + b
 * R('foo')(cat)('bar') // 'barfoo'
 * ```
 */
export const R: Robin = (a) => (f) => (b) => f(b)(a);

/** The Robin, by name. Identical to {@link R}. */
export const robin: Robin = R;
