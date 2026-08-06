/**
 * Recursive types for the hard forest.
 *
 * Five birds — the Mockingbird, Lark, Owl, Turing bird and Sage — involve
 * SELF-APPLICATION, applying a term to itself. None of them can be typed in a
 * simply-typed lambda calculus: that is a theorem about the calculus, not a
 * shortcoming of TypeScript. In System F you would need something like
 * `∀a. a → a` applied to itself, which is ill-founded.
 *
 * TypeScript gets through because its `interface` declarations are resolved
 * LAZILY and may reference themselves. `SelfApplicable<A>` below is a function
 * type whose parameter is its own type — legal here, impossible in Hindley
 * Milner without an explicit iso-recursive wrapper (Haskell's `newtype Mu`).
 *
 * This is one of the few places where TypeScript's structural, equirecursive
 * type system is genuinely MORE expressive than Haskell's, rather than less.
 *
 * The cost is honest and worth stating: a `SelfApplicable<A>` says nothing
 * about termination. `M(M)` is well typed and loops forever. The type system
 * is protecting you from type errors, not from divergence — no type system in
 * a Turing-complete language can promise the latter.
 */

/**
 * A function that can be applied to itself, yielding `A`.
 *
 * The self-reference in the parameter position is what makes the Mockingbird
 * expressible.
 */
export interface SelfApplicable<A> {
  (x: SelfApplicable<A>): A;
}

/**
 * The self-applicable shape used by the Turing bird, whose self-application is
 * followed by a further argument.
 */
export interface TuringSelf<A> {
  (x: TuringSelf<A>): (y: (a: A) => A) => A;
}

/**
 * The self-applicable shape used by the Sage bird's fixed-point construction.
 * Applying it to itself produces the recursive function itself.
 */
export interface SageSelf<A, B> {
  (x: SageSelf<A, B>): (a: A) => B;
}
