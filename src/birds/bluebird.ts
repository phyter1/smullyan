/**
 * The Bluebird — `B`.
 *
 * ```text
 * B f g x = f (g x)
 * ```
 *
 * Function composition. Smullyan's Bluebird is the combinator that lets one
 * bird's response become another's call, and it is the backbone of the whole
 * forest: `B` plus `C` (Cardinal) plus `W` (Warbler) plus `K` (Kestrel) is a
 * basis for all of combinatory logic.
 *
 * Authoring pattern — every combinator in this library follows it:
 *
 *   1. A named `interface` declaring the call signature.
 *   2. An annotated `const` implementing it.
 *   3. Alias `const`s for the bird name and the familiar FP name.
 *
 * The interface exists because `isolatedDeclarations` is enabled for `src/`,
 * which requires every exported binding to carry a syntactically-derivable
 * type. That turns the public type surface into a written artifact rather than
 * an inference result that can drift between compiler releases.
 *
 * CAVEAT, and it is a real one: nothing checks that the interface AGREES with
 * the implementation beyond assignability. An interface declared WIDER than
 * the implementation compiles and ships. The property-based law suite is the
 * only net, which is why every law must exercise the exported `const` and
 * never an internal helper.
 *
 * GENERIC SCOPING — the rule every combinator here must follow:
 *
 * Each type parameter belongs on the call signature that SUPPLIES it, never
 * on an earlier one. Writing the signature as
 *
 *   <A, B, C>(f: (b: B) => C): (g: (a: A) => B) => (a: A) => C
 *
 * compiles fine and is wrong: `A` appears nowhere in `f`, so at the first call
 * TypeScript has nothing to infer it from and silently defaults it to
 * `unknown`. Every later application then fails with "Type 'unknown' is not
 * assignable to type 'number'". Scoping `A` to the second call fixes it.
 *
 * This is the single most common way a curried combinator's typings go wrong,
 * and positive `expectTypeOf` assertions alone will not always reveal it —
 * which is why the negative `@ts-expect-error` suite exists.
 */
export interface Bluebird {
  <B, C>(f: (b: B) => C): <A>(g: (a: A) => B) => (a: A) => C;
}

/**
 * Compose two functions, right to left.
 *
 * @example
 * ```ts
 * import { B } from 'smullyan/birds'
 *
 * const inc = (n: number): number => n + 1
 * const show = (n: number): string => String(n)
 *
 * const incThenShow = B(show)(inc)
 * incThenShow(1) // '2'
 * ```
 */
export const B: Bluebird = (f) => (g) => (a) => f(g(a));

/** The Bluebird, by name. Identical to {@link B}. */
export const bluebird: Bluebird = B;

/** Right-to-left function composition. Identical to {@link B}. */
export const compose: Bluebird = B;
