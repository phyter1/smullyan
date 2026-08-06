/**
 * The Idiot once removed — `I*`.
 *
 * ```text
 * I* f x = f x
 * ```
 *
 * Explicit function application. `I*` is the Identity bird lifted one level:
 * where `I` returns its argument, `I*` returns its argument APPLIED. It is
 * extensionally equal to `I` on functions — `I* f ≡ I f` — which the law suite
 * asserts, and it is what most languages call `apply`.
 */
export interface IdiotOnceRemoved {
  <A, B>(f: (a: A) => B): (a: A) => B;
}

/**
 * Apply a function to a value.
 *
 * @example
 * ```ts
 * import { IStar } from 'smullyan/birds'
 *
 * const inc = (n: number): number => n + 1
 * IStar(inc)(41) // 42
 * ```
 */
export const IStar: IdiotOnceRemoved = (f) => (a) => f(a);

/** The Idiot once removed, by name. Identical to {@link IStar}. */
export const idiotOnceRemoved: IdiotOnceRemoved = IStar;

/** Explicit function application. Identical to {@link IStar}. */
export const apply: IdiotOnceRemoved = IStar;
