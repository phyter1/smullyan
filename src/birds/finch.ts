/**
 * The Finch — `F`.
 *
 * ```text
 * F x y f = f y x
 * ```
 *
 * Hold two values, then apply a function to them in reverse order. The Finch is
 * the Vireo's mirror — `F ≡ C V` — which the law suite asserts.
 */
export interface Finch {
  <A>(a: A): <B>(b: B) => <C>(f: (b: B) => (a: A) => C) => C;
}

/**
 * Hold two values and apply a function to them reversed.
 *
 * @example
 * ```ts
 * import { F } from 'smullyan/birds'
 *
 * const cat = (a: string) => (b: string): string => a + b
 * F('foo')('bar')(cat) // 'barfoo'
 * ```
 */
export const F: Finch = (a) => (b) => (f) => f(b)(a);

/** The Finch, by name. Identical to {@link F}. */
export const finch: Finch = F;
