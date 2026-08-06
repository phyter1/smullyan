/**
 * The Queer bird — `Q`.
 *
 * ```text
 * Q f g x = g (f x)
 * ```
 *
 * Composition in READING order: `Q f g` runs `f` first, then `g`. The Bluebird
 * composes right-to-left; the Queer bird is its left-to-right twin, and
 * `Q ≡ C B` — which the law suite asserts.
 *
 * This is the shape most people mean by "pipe two functions together".
 */
export interface Queer {
  <A, B>(f: (a: A) => B): <C>(g: (b: B) => C) => (a: A) => C;
}

/**
 * Compose two functions left to right.
 *
 * @example
 * ```ts
 * import { Q } from 'smullyan/birds'
 *
 * const inc = (n: number): number => n + 1
 * const show = (n: number): string => String(n)
 *
 * Q(inc)(show)(41) // '42'
 * ```
 */
export const Q: Queer = (f) => (g) => (a) => g(f(a));

/** The Queer bird, by name. Identical to {@link Q}. */
export const queer: Queer = Q;

/** Left-to-right composition. Identical to {@link Q}. */
export const pipe2: Queer = Q;
