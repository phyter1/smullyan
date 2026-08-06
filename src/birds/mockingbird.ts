import type { SelfApplicable } from './self-application';

/**
 * The Mockingbird — `M`.
 *
 * ```text
 * M x = x x
 * ```
 *
 * Self-application, and the bird the book is named for. The Mockingbird
 * responds to every call by repeating it back to itself.
 *
 * `M` is NOT typeable in a simply-typed lambda calculus. TypeScript expresses
 * it via {@link SelfApplicable}, a lazily-resolved self-referential interface —
 * see `self-application.ts` for why that works.
 *
 * ## Divergence
 *
 * `M(M)` is the classic non-terminating term `Ω`. It type-checks and it hangs.
 * That is not a bug here: `Ω` has no normal form, so no implementation could do
 * better. Types rule out type errors, not infinite loops.
 *
 * The Mockingbird is only useful when applied to something that IGNORES or
 * bounds its argument — which is exactly how the Sage bird uses it internally.
 */
export interface Mockingbird {
  <A>(x: SelfApplicable<A>): A;
}

/**
 * Apply a function to itself.
 *
 * @example
 * ```ts
 * import { M } from 'smullyan/birds'
 * import type { SelfApplicable } from 'smullyan/birds'
 *
 * // Safe: ignores its argument, so it terminates.
 * const answer: SelfApplicable<number> = () => 42
 * M(answer) // 42
 *
 * // M(M) would type-check and loop forever — this is the term Ω.
 * ```
 */
export const M: Mockingbird = (x) => x(x);

/** The Mockingbird, by name. Identical to {@link M}. */
export const mockingbird: Mockingbird = M;
