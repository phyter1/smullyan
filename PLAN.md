# fnctnl — Build Plan

A fully typesafe functional programming package for TypeScript, organised around the
combinatory-logic "birds" of Raymond Smullyan's *To Mock a Mockingbird*, plus a small
core of algebraic data types.

---

## 1. Guiding constraints

These are decided, not open questions:

| Concern | Decision |
|---|---|
| npm name | **`smullyan`** (unscoped — `fnctnl` was taken; local dir stays `fnctnl`) |
| Repo | **`phyter1/smullyan`** on GitHub, **public** |
| License | **MIT** |
| Scope | Bird combinators + core ADTs (Option, Result, Task, Reader) + pipe/flow |
| Export naming | **Triple alias** — `B` / `bluebird` / `compose` (§3.3) |
| Currying | **Curried only** — one call signature per bird (§3.4) |
| Package manager | pnpm (via corepack) |
| Compiler | TypeScript **7.x** (Go-native, GA 2026-07-08) |
| Test runner | Vitest |
| Type-level tests | `expect-type` + negative `@ts-expect-error` suite + multi-version matrix |
| Lint | oxlint 1.75+ with **type-aware rules enabled** (tsgolint) |
| Format | oxfmt |
| Bundler | **tsdown** (rolldown; native `.d.ts` via oxc-transform) |
| Coverage | 100% lines/branches/functions/statements, enforced as a hard gate |
| Secrets | gitleaks (pre-commit + CI) |
| Deps | Snyk (fail-soft until `SNYK_TOKEN` lands), OSV-Scanner, Renovate |
| Supply chain | npm provenance, OIDC trusted publishing, CodeQL, OpenSSF Scorecard, SHA-pinned actions |

Explicitly **not** used: ESLint, Prettier.

**Rejected, with reasons:** self-hosted Gitea as CI host — npm trusted publishing accepts OIDC
from only GitHub Actions, GitLab CI, and CircleCI, so provenance would have been unattainable;
and the CodeQL CLI license forbids automated analysis of codebases not hosted on GitHub.com
without a paid GitHub Advanced Security licence.

---

## 2. Package shape

Single package, multiple entry points, so consumers tree-shake to exactly what they import.

```
smullyan
├── smullyan            # curated re-export of the common surface
├── smullyan/birds      # the full aviary
├── smullyan/option
├── smullyan/result
├── smullyan/task
├── smullyan/reader
└── smullyan/pipe       # pipe / flow / compose
```

Every module is:
- side-effect free (`"sideEffects": false`)
- ESM-first, with a CJS build for compatibility
- shipped with hand-written `.d.ts` assertions verified by type tests, not just emitted types

---

## 3. The aviary

Smullyan's birds, each with its combinatory definition and its everyday FP name.
This is the full target list — roughly 35 combinators.

### 3.1 Directly typeable (the easy forest)

| Bird | Symbol | Definition | Familiar as |
|---|---|---|---|
| Idiot | `I` | `I x = x` | `identity` |
| Kestrel | `K` | `K x y = x` | `const` |
| Kite | `KI` | `KI x y = y` | `const id` |
| Cardinal | `C` | `C f x y = f y x` | `flip` |
| Bluebird | `B` | `B f g x = f (g x)` | `compose` |
| Blackbird | `B1` | `B1 f g x y = f (g x y)` | `compose2` |
| Bunting | `B2` | `B2 f g x y z = f (g x y z)` | `compose3` |
| Becard | `B3` | `B3 f g h x = f (g (h x))` | 3-way compose |
| Starling | `S` | `S f g x = f x (g x)` | `ap` (Reader) |
| Thrush | `T` | `T x f = f x` | `applyTo`, `pipe`₁ |
| Vireo | `V` | `V x y f = f x y` | `pair` / `cons` |
| Warbler | `W` | `W f x = f x x` | `join` (Reader) |
| Queer | `Q` | `Q f g x = g (f x)` | `pipe`-order compose |
| Quixotic | `Q1` | `Q1 f g x = f (g x)` | — |
| Quizzical | `Q2` | `Q2 f g x = g (f x)` | — |
| Quirky | `Q3` | `Q3 f g x = g (f x)` | — |
| Quacky | `Q4` | `Q4 f g x = g (f x)` | — |
| Robin | `R` | `R x f y = f y x` | — |
| Finch | `F` | `F x y f = f y x` | — |
| Goldfinch | `G` | `G f g x y = f y (g x)` | — |
| Cardinal once removed | `C*` | `C* f x y z = f x z y` | flip inner |
| Dove | `D` | `D f x g y = f x (g y)` | — |
| Dickcissel | `D1` | `D1 f x y g z = f x y (g z)` | — |
| Dovekies | `D2` | `D2 f g x h y = f (g x) (h y)` | — |
| Eagle | `E` | `E f x g y z = f x (g y z)` | — |
| Phoenix | `Φ` | `Φ f g h x = f (g x) (h x)` | `converge`, `liftA2` (Reader) |
| Psi | `Ψ` | `Ψ f g x y = f (g x) (g y)` | `on` |
| Jay | `J` | `J f x y z = f x (f z y)` | — |
| Hummingbird | `H` | `H f x y = f x y x` | — |
| Idiot once removed | `I*` | `I* f x = f x` | `apply` |
| Warbler once removed | `W*` | `W* f x y = f x y y` | — |

### 3.2 The hard forest — birds that are *not* simply typeable

This is the genuinely interesting part of the package, and the section that will need
the most design care.

| Bird | Definition | Problem |
|---|---|---|
| Mockingbird | `M x = x x` | Self-application. Requires a recursive type. |
| Lark | `L x y = x (y y)` | Same. |
| Owl | `O f g = g (f g)` | Same. |
| Turing | `U x y = y (x x y)` | Same. |
| Sage / Y | `Y f = f (Y f)` | The fixed-point combinator. |

None of these type in a simply-typed lambda calculus — that's a theorem, not a TypeScript
limitation. TypeScript's *equirecursive-ish* interfaces do give us a way through:

```ts
// Mockingbird needs a type that can be applied to itself.
interface SelfApplicable<A> {
  (x: SelfApplicable<A>): A
}
export const M = <A>(x: SelfApplicable<A>): A => x(x)
```

`Y` is then expressible with an explicit fixpoint signature rather than untyped
self-application. We will document, per bird, **exactly** which typing strategy was
used and what it costs, because "fully typesafe" here means honest about the boundary,
not pretending the boundary isn't there.

Hard rule: **zero `any` in published types.** Where variance genuinely requires an
escape hatch we use `unknown` plus a documented, tested narrowing — never `any`.

### 3.3 Export naming — triple alias

Each combinator has exactly one implementation, exported under three names: the
combinatory **symbol**, the **bird**, and the familiar **FP name** where one exists.

```ts
export const B =
  <A, B, C>(f: (b: B) => C) =>
  (g: (a: A) => B) =>
  (a: A): C =>
    f(g(a))

export const bluebird = B
export const compose = B
```

Aliases are `const` bindings of the same function, so they tree-shake identically and
cost nothing at runtime. Every alias still gets its own type-level assertion — aliases
are exactly where signatures silently drift.

Birds with no common FP name (Dovekies, Dickcissel, Becard) export symbol + bird only.

### 3.4 Currying — curried only

One call signature per bird. `B(f)(g)(x)`, never `B(f, g, x)`.

This is the faithful combinatory form, and partial application is the entire point of
these functions. It also keeps inference exact: with a single call signature there is no
overload resolution, and therefore none of the `unknown` leakage that arises when
TypeScript picks the first matching overload in a partially-applied position.

Where an all-at-once form is genuinely more ergonomic (`on`, `converge`), we add it by
hand as a separately-named, separately-typed export — not as an overload.

---

## 4. ADT layer

Small, unopinionated, no typeclass hierarchy. Each is a discriminated union with
exhaustive `match`.

- **`Option<A>`** — `Some<A> | None`
- **`Result<E, A>`** — `Ok<A> | Err<E>` (error type first, so `Result<E, _>` partially applies)
- **`Task<A>`** — lazy `() => Promise<A>`, plus `TaskResult<E, A>`
- **`Reader<R, A>`** — `(r: R) => A`, the environment monad the Starling/Phoenix birds
  are secretly about

Each gets: constructors, `map`, `flatMap`, `match`, `getOrElse`, `fromNullable`,
`fromThrowable`, type guards, and traversal/sequence helpers.

**`pipe` / `flow`** get hand-written overload chains to ~20 arguments with full inference.

---

## 5. Testing strategy

"Fully test covered" for a library like this means three distinct layers.

### 5.1 Runtime tests (Vitest)
Standard unit tests, gated at **100%** on lines, branches, functions, and statements
via `@vitest/coverage-v8`. The build fails below the threshold.

### 5.2 Type-level tests (`expect-type`, run inside Vitest)
Every signature asserted directly:

```ts
expectTypeOf(B(inc)(String)).toEqualTypeOf<(x: number) => string>()
```

Positive assertions alone are not sufficient — they pass just as happily against an
over-permissive `any`.

### 5.3 Negative type tests (`@ts-expect-error`)
A dedicated suite asserting that *incorrect* usage **fails to compile**. This is the only
way to prove a signature actually rejects bad input, and it's what catches accidental
`any` leaks.

### 5.4 Algebraic law tests (fast-check)
The birds have known identities. We assert them as properties over generated inputs:

- `I` is the identity: `I(x) === x`
- `B` is associative: `B(B(f)(g))(h) ≡ B(f)(B(g)(h))`
- `C(C(f)) ≡ f` — the Cardinal is its own inverse
- `S(K)(K) ≡ I` — the classic SKI derivation
- `W(K) ≡ I`
- Monad laws for `Option`, `Result`, `Task`: left identity, right identity, associativity
- Functor laws: identity and composition preservation

This is where a combinator library earns real confidence. Line coverage tells you a
function ran; a law test tells you it was *correct*.

### 5.5 CI type matrix
Type tests run against TS **7.x latest** and TS **next**, so inference regressions in the
compiler surface here rather than in a consumer's build.

---

## 6. Guardrails

### 6.1 Local (pre-commit, via lefthook — Rust-adjacent, faster than husky)
- `oxfmt --check` on staged files
- `oxlint --type-aware` on staged files
- `tsc --noEmit` (fast enough now under TS 7)
- `gitleaks protect --staged`
- commit message linted against Conventional Commits

### 6.2 CI (GitHub Actions, every action pinned to a full commit SHA)
- **quality** — format check, lint (type-aware), typecheck
- **test** — Vitest + 100% coverage gate + law tests
- **types** — type-test matrix across TS versions
- **security** — gitleaks (full history), Snyk `test` + `monitor`, OSV-Scanner,
  CodeQL, OpenSSF Scorecard
- **build** — tsup build, then verify the emitted `.d.ts` against a consumer smoke test
  under both `node16` and `bundler` module resolution
- **publish** — Changesets → npm **trusted publishing via OIDC** (no long-lived
  `NPM_TOKEN` in the repo) with provenance attestation

### 6.3 Repo hygiene
- Branch protection on `main`, PR-only, squash merge
- Signed commits required
- Renovate for dependency updates
- `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- Changesets for versioning and changelog

---

## 7. Milestones

| # | Milestone | Contents |
|---|---|---|
| 0 | Skeleton | pnpm init, TS 7, tsconfig strictest, Vitest, tsup, exports map |
| 1 | Guardrails | oxlint + oxfmt + lefthook + gitleaks + CI quality/security jobs |
| 2 | Easy forest | §3.1 birds, curried + uncurried, full three-layer tests |
| 3 | Hard forest | §3.2 recursive-type birds, with a written rationale per bird |
| 4 | Laws | fast-check property suite, SKI derivations |
| 5 | pipe/flow | overload chains + inference tests |
| 6 | ADTs | Option, Result, Task, Reader |
| 7 | Release | Changesets, OIDC publish, provenance, docs site |

Milestone 1 lands before Milestone 2 deliberately: the guardrails exist to shape the
code, so they go in before there's code to shape.

---

## 8. Accepted risks

### 8.1 oxfmt is beta
oxfmt is at v0.60 and still labelled beta. Low risk for a formatter — worst case is
cosmetic churn on a future upgrade. Recorded as a known accepted risk.

### 8.2 Snyk token not yet present
The Snyk job ships written but fail-soft: it skips cleanly when `SNYK_TOKEN` is absent
and activates automatically once the secret is added, with no code change. OSV-Scanner,
CodeQL, gitleaks, and Scorecard need no secret and run from day one.

### 8.3 `fnctnl` local directory vs `smullyan` package name
The working directory stays `/Users/ryanlowe/code/fnctnl`; the published package and
GitHub repo are both `smullyan`. Divergence is intentional and harmless, but worth
remembering when navigating.
