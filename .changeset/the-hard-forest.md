---
'smullyan': minor
---

Add the hard forest — the five combinators that are not typeable in a
simply-typed lambda calculus: Mockingbird (`M`), Lark (`L`), Owl (`O`), Turing
bird (`U`) and Sage (`Y`/`fix`), plus the recursive types `SelfApplicable`,
`TuringSelf` and `SageSelf` that make them expressible.

`Y` is the Z combinator — the eta-expanded fixed point that terminates under
eager evaluation — implemented through genuine self-application rather than a
named self-reference. This completes the aviary at thirty-five combinators.
