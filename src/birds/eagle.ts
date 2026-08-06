/**
 * The Eagle — `E`.
 *
 * ```text
 * E f x g y z = f x (g y z)
 * ```
 *
 * Apply a binary function whose second argument is itself produced by a binary
 * function. `E ≡ B (B B B)`, though as with the other higher compositions that
 * derivation is not typeable here.
 */
export interface Eagle {
  <X, R, S>(
    f: (x: X) => (r: R) => S,
  ): (x: X) => <Y, Z>(g: (y: Y) => (z: Z) => R) => (y: Y) => (z: Z) => S;
}

/** Apply a binary function whose second argument comes from another binary function. */
export const E: Eagle = (f) => (x) => (g) => (y) => (z) => f(x)(g(y)(z));

/** The Eagle, by name. Identical to {@link E}. */
export const eagle: Eagle = E;
