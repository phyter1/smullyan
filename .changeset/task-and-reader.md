---
'smullyan': minor
---

Add `Task<A>` at `smullyan/task` and `Reader<R, A>` at `smullyan/reader`.

`Task` is a thunked promise — a description of asynchronous work rather than
work already in flight, so it can be retried, delayed and composed
referentially. `Reader` is the environment monad, whose `map`, `ap` and
`flatten` are the Bluebird, Starling and Warbler respectively; the law suite
asserts those equivalences directly.

Also fixes silent type-parameter widening in `Result.map`, `Result.mapErr`,
`Result.flatMap`, `Result.ap` and `Reader.map`, where `E`/`R` were declared on
a call that could not infer them and defaulted to `unknown`.
