/**
 * The Becard — `B3`.
 *
 * ```text
 * B3 f g h x = f (g (h x))
 * ```
 *
 * Three-way right-to-left composition. `B3 ≡ B (B B) B`, though — as with the
 * Blackbird — that derivation is not typeable in TypeScript. The law suite
 * asserts the rank-1 equivalent `B3 f g h ≡ B (B f g) h`.
 */
export interface Becard {
  <C, D>(f: (c: C) => D): <B>(g: (b: B) => C) => <A>(h: (a: A) => B) => (a: A) => D;
}

/**
 * Compose three functions right to left.
 *
 * @example
 * ```ts
 * import { B3 } from 'smullyan/birds'
 *
 * const inc = (n: number): number => n + 1
 * const dbl = (n: number): number => n * 2
 * const show = (n: number): string => String(n)
 *
 * B3(show)(dbl)(inc)(20) // '42'
 * ```
 */
export const B3: Becard = (f) => (g) => (h) => (a) => f(g(h(a)));

/** The Becard, by name. Identical to {@link B3}. */
export const becard: Becard = B3;

/** Three-way right-to-left composition. Identical to {@link B3}. */
export const compose3: Becard = B3;
