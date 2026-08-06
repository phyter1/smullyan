/**
 * The Warbler once removed — `W*`.
 *
 * ```text
 * W* f x y = f x y y
 * ```
 *
 * The Warbler shifted one argument deeper: the FIRST argument passes through
 * untouched and the second is duplicated. `W* ≡ B W`, asserted in the law suite.
 */
export interface WarblerOnceRemoved {
  <A, B, C>(f: (a: A) => (b: B) => (b2: B) => C): (a: A) => (b: B) => C;
}

/** Apply a ternary function with its second argument duplicated into the third. */
export const WStar: WarblerOnceRemoved = (f) => (a) => (b) => f(a)(b)(b);

/** The Warbler once removed, by name. Identical to {@link WStar}. */
export const warblerOnceRemoved: WarblerOnceRemoved = WStar;
