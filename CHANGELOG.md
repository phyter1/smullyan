# smullyan

## 0.4.0
### Minor Changes



- [#18](https://github.com/phyter1/smullyan/pull/18) [`8c1680f`](https://github.com/phyter1/smullyan/commit/8c1680f030d0dae66f9cca344439e466f134ea2e) Thanks [@phyter1](https://github.com/phyter1)! - **Breaking (experimental dialect):** 29 Spanish identifiers renamed following
  adversarial review. Notably `obtenerOSino`/`oSino` → `obtenerODefecto`/`oBien`
  (`sino` means "but rather"; "otherwise" is `si no`), `todas` → `enParalelo`
  (the old name hid that the calls are concurrent), `segun` → `plegar`, and the
  `ap`/`apply` mapping, which was inverted.
  
  Also adds a global bijectivity gate: two different concepts sharing one foreign
  name now fails the build, because the codemod's rename map is global and would
  otherwise translate back to the wrong concept.
  
  Spanish remains `@experimental` and unreviewed by a native speaker.

## 0.3.0
### Minor Changes



- [#15](https://github.com/phyter1/smullyan/pull/15) [`0f7854a`](https://github.com/phyter1/smullyan/commit/0f7854a9a19bd1f97fc98e180eae8bb2697c3242) Thanks [@phyter1](https://github.com/phyter1)! - Add `smullyan/agent` — typed, serializable tool calls for agentic systems.
  
  A closed `ToolError` vocabulary whose fields are chosen so that both a program
  and a language model can act on them: `RateLimited` carries how long to wait,
  `InvalidArgs` carries which argument was wrong, `NotFound` carries near-misses.
  `explain` renders any of them as a sentence written for a model to read, and
  `parse` validates one back from the wire rather than casting.
  
  Retry, timeout and fallback compose over `Tool<A>` — a thunked `Result` — with
  the clock injected rather than reached for, so backoff schedules are pure data
  and exactly testable with a fake clock.
  
  Two dialects, one implementation. The readable one wraps every scalar in a
  role or unit — `seconds(10)`, `upTo(4).attempts`, `whileTransient` — so a call
  site states its own meaning without a signature lookup.


- [#17](https://github.com/phyter1/smullyan/pull/17) [`a476e13`](https://github.com/phyter1/smullyan/commit/a476e13421eeccb559584f931106cf4c58e7fcfb) Thanks [@phyter1](https://github.com/phyter1)! - Add translatable dialects. `smullyan/es/*` exposes the whole library under
  Spanish names, generated from a single registry, and `pnpm translate` rewrites
  source files between dialects mechanically.
  
  This is possible because the library has no free-form surface — no method
  chains, no string DSL, no config keys — so a program is a closed vocabulary
  composed positionally, and only the identifiers carry language.
  
  Three properties are enforced at build time: the mapping is **total** (every
  concept named in every language), **injective** (no two concepts share a name
  within a module), and **reversible** (`translate(a → b → a)` is the identity,
  asserted as a property test).
  
  @experimental Non-English dialects are machine-generated and have not been
  reviewed by a native speaker. English remains the reference dialect.

## 0.2.0
### Minor Changes



- [#13](https://github.com/phyter1/smullyan/pull/13) [`8e6633a`](https://github.com/phyter1/smullyan/commit/8e6633a06a7a46bb74ff9b7e5e3999b3fca3be8c) Thanks [@phyter1](https://github.com/phyter1)! - **Breaking:** the ADTs are no longer re-exported from the root entry. Import
  them from their subpaths instead:
  
  ```ts
  // before
  import { Option, Result } from 'smullyan'
  
  // after
  import * as Option from 'smullyan/option'
  import * as Result from 'smullyan/result'
  ```
  
  The birds, `pipe` and `flow` are unaffected and still come from `smullyan`.
  
  `export * as Ns from './x'` made the bundler build a namespace object, place it
  in a chunk shared with the `x` entry point, and re-export it from there under a
  minified name — leaking `export { … as t }` into the public API of
  `smullyan/result`. `publint` and `attw` both pass such an export because it is
  structurally valid; it is simply not one anybody wrote. Subpath imports were
  already the documented preference, and each ADT defines `map`, `flatMap`,
  `match` and `getOrElse`, so a flattened root export was never possible anyway.
  
  Marked `minor` rather than `patch` because 0.1.0 did ship the root re-exports,
  so this removes API a consumer could be using. Under semver, 0.x carries
  breaking changes in the minor slot.
  
  Also points `homepage` at the new documentation site:
  <https://phyter1.github.io/smullyan/>.

## 0.1.0
### Minor Changes



- [#4](https://github.com/phyter1/smullyan/pull/4) [`53df882`](https://github.com/phyter1/smullyan/commit/53df88255c82172986517d42438f0fd8fd8fd6a9) Thanks [@phyter1](https://github.com/phyter1)! - Add eleven combinators to the aviary: Idiot (`I`/`identity`), Kestrel
  (`K`/`constant`), Kite (`KI`), Bluebird (`B`/`compose`), Blackbird
  (`B1`/`compose2`), Cardinal (`C`/`flip`), Warbler (`W`/`duplicate`), Thrush
  (`T`/`applyTo`), Starling (`S`/`ap`), Psi (`P`/`on`), and Phoenix
  (`Phi`/`converge`).
  
  Each is curried, exported under its symbol, bird name, and familiar FP name
  where one exists, and covered by runtime tests, type-level assertions, and
  property-based algebraic laws including the `S K K ≡ I` and `W K ≡ I`
  derivations.


- [#5](https://github.com/phyter1/smullyan/pull/5) [`71e9d11`](https://github.com/phyter1/smullyan/commit/71e9d112ab1ac2253ca2d23013267e5b05d0e241) Thanks [@phyter1](https://github.com/phyter1)! - Add nineteen more combinators, bringing the aviary to thirty: Vireo (`V`/`pair`),
  Robin (`R`), Finch (`F`), Queer (`Q`/`pipe2`), the four Q-birds (`Q1`–`Q4`),
  Becard (`B3`/`compose3`), Bunting (`B2`), Goldfinch (`G`), Dove (`D`),
  Dickcissel (`D1`), Dovekies (`D2`), Eagle (`E`), Jay (`J`), Hummingbird (`H`),
  and the once-removed birds `IStar`/`apply`, `WStar` and `CStar`.


- [#8](https://github.com/phyter1/smullyan/pull/8) [`bcbb209`](https://github.com/phyter1/smullyan/commit/bcbb2094d108fdd1b5874e695ba06906ea42599c) Thanks [@phyter1](https://github.com/phyter1)! - Add `Option<A>` at `smullyan/option` and `Result<E, A>` at `smullyan/result`.
  
  Both are discriminated unions rather than classes, so they narrow with a bare
  `switch` on `_tag`, survive `JSON.stringify`, and carry no prototype. Every
  combinator is curried and data-last so it drops straight into `pipe`. Monad,
  functor and applicative laws are asserted with property tests.


- [#7](https://github.com/phyter1/smullyan/pull/7) [`8fca8cd`](https://github.com/phyter1/smullyan/commit/8fca8cdd40e51298ecd9ea851b14625f8ffeabbc) Thanks [@phyter1](https://github.com/phyter1)! - Add `pipe` and `flow` at `smullyan/pipe`, with hand-written overload chains
  giving exact inference for up to twenty functions. `pipe` threads a value
  left to right; `flow` composes functions without supplying a value, and its
  first function may take any number of arguments.


- [#9](https://github.com/phyter1/smullyan/pull/9) [`cd35826`](https://github.com/phyter1/smullyan/commit/cd35826fc422dea95b30b3ad4293ffc29ec39d96) Thanks [@phyter1](https://github.com/phyter1)! - Add `Task<A>` at `smullyan/task` and `Reader<R, A>` at `smullyan/reader`.
  
  `Task` is a thunked promise — a description of asynchronous work rather than
  work already in flight, so it can be retried, delayed and composed
  referentially. `Reader` is the environment monad, whose `map`, `ap` and
  `flatten` are the Bluebird, Starling and Warbler respectively; the law suite
  asserts those equivalences directly.
  
  Also fixes silent type-parameter widening in `Result.map`, `Result.mapErr`,
  `Result.flatMap`, `Result.ap` and `Reader.map`, where `E`/`R` were declared on
  a call that could not infer them and defaulted to `unknown`.


- [#6](https://github.com/phyter1/smullyan/pull/6) [`d559f06`](https://github.com/phyter1/smullyan/commit/d559f0681015433a8871ab2ef12030c5a1e99a92) Thanks [@phyter1](https://github.com/phyter1)! - Add the hard forest — the five combinators that are not typeable in a
  simply-typed lambda calculus: Mockingbird (`M`), Lark (`L`), Owl (`O`), Turing
  bird (`U`) and Sage (`Y`/`fix`), plus the recursive types `SelfApplicable`,
  `TuringSelf` and `SageSelf` that make them expressible.
  
  `Y` is the Z combinator — the eta-expanded fixed point that terminates under
  eager evaluation — implemented through genuine self-application rather than a
  named self-reference. This completes the aviary at thirty-five combinators.
