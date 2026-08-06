---
'smullyan': minor
---

Add `Option<A>` at `smullyan/option` and `Result<E, A>` at `smullyan/result`.

Both are discriminated unions rather than classes, so they narrow with a bare
`switch` on `_tag`, survive `JSON.stringify`, and carry no prototype. Every
combinator is curried and data-last so it drops straight into `pipe`. Monad,
functor and applicative laws are asserted with property tests.
