import type { SageSelf } from './self-application';

/**
 * The Sage bird — `Y`.
 *
 * ```text
 * Y f = f (Y f)
 * ```
 *
 * The fixed-point combinator, and the reason anonymous functions can recurse.
 * `Y` takes a function that expects "itself" as its first argument and returns
 * the recursive function, with no name ever bound.
 *
 * ## Why this is the Z combinator, not the Y combinator
 *
 * The textbook `Y = λf.(λx.f (x x)) (λx.f (x x))` is correct under LAZY
 * evaluation and diverges under eager evaluation: computing `f (x x)` demands
 * `x x` before `f` can decide whether it needs it, and `x x` expands forever.
 * JavaScript is eager, so the textbook form stack-overflows immediately.
 *
 * The fix is eta-expansion — wrapping the recursive call in a lambda so it is
 * only forced when an argument actually arrives:
 *
 * ```text
 * Z = λf. (λx. f (λv. x x v)) (λx. f (λv. x x v))
 * ```
 *
 * `Z` is extensionally equal to `Y` for functions of at least one argument,
 * which is every practical use. The implementation below is `Z`, written with
 * genuine self-application rather than a named self-reference.
 *
 * ## Why not just use a named function?
 *
 * ```ts
 * const fix = (f) => { const g = (a) => f(g)(a); return g }  // NOT this
 * ```
 *
 * That works, but it defeats the point: `g` refers to itself by NAME, so it is
 * ordinary recursion wearing a combinator's clothes. The Sage bird's whole
 * purpose is achieving recursion WITHOUT self-reference, using only
 * application. The implementation below does that — `rec(rec)` is the only
 * mechanism, and `rec` never mentions itself inside its own body.
 */
export interface Sage {
  <A, B>(f: (rec: (a: A) => B) => (a: A) => B): (a: A) => B;
}

/**
 * Compute the fixed point of `f`, giving a recursive function with no name.
 *
 * @example
 * ```ts
 * import { Y } from 'smullyan/birds'
 *
 * const factorial = Y<number, number>(
 *   (rec) => (n) => (n <= 1 ? 1 : n * rec(n - 1)),
 * )
 *
 * factorial(5) // 120
 * ```
 */
export const Y: Sage = <A, B>(f: (rec: (a: A) => B) => (a: A) => B): ((a: A) => B) => {
  // The eta-expansion is `(a) => f(x(x))(a)` rather than `f(x(x))`. Without it,
  // `x(x)` is forced immediately and recurses forever under eager evaluation.
  const rec: SageSelf<A, B> = (x) => (a) => f(x(x))(a);
  return rec(rec);
};

/** The Sage bird, by name. Identical to {@link Y}. */
export const sage: Sage = Y;

/** The fixed-point combinator. Identical to {@link Y}. */
export const fix: Sage = Y;
