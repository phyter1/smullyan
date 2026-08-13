# smullyan — working notes

A fully typesafe functional-programming library for TypeScript: the
combinatory-logic bird combinators of Smullyan's _To Mock a Mockingbird_, plus
`Option`, `Result`, `Task`, `Reader`, `pipe`/`flow`, a typed tool-call layer for
agents, and translatable natural-language dialects.

**Published:** `smullyan` on npm · **Docs:** <https://phyter1.github.io/smullyan/>
· **Repo:** `phyter1/smullyan` (public, MIT)

The local directory is `~/code/fnctnl`; the package and repo are both
`smullyan`. That divergence is deliberate and harmless.

---

## Where things stand

`0.4.0` is published. Everything in the original plan (`PLAN.md`) is shipped.

| Area        | State                                                          |
| ----------- | -------------------------------------------------------------- |
| Aviary      | **36** combinators, easy and hard forest complete              |
| ADTs        | `Option`, `Result`, `Task`, `Reader`                           |
| Composition | `pipe`, `flow` — overload chains to 20 arities                 |
| Agent       | `smullyan/agent` — typed tool calls, retry/timeout/fallback    |
| Dialects    | `smullyan/es/*` — Spanish, experimental                        |
| Docs        | VitePress site, generated API reference, deployed to Pages     |
| Release     | Fully automatic: signed commits, OIDC publish, SLSA provenance |
| Tests       | 292, 100% coverage, no ignores anywhere                        |

### Open items

1. **Spanish needs a native speaker.** `reviewedBy.es` is `null`. Three
   adversarial LLM reviews produced 29 corrections, recorded in
   `machineReviewed` — deliberately NOT the same field, because machine review
   is not native review. `openQuestions` in `src/lang/registry.ts` lists the
   **four** judgement calls that remain (`exito` vs `acierto`, `desdeAnulable`,
   `preguntar` vs `pedir` for Reader's `ask`, and `enlazar` for flatMap). The
   other four were settled against cited sources rather than intuition and are
   recorded in `resolvedQuestions` with `native: false` — that flag is the whole
   point, so a documented-usage decision can never be mistaken for a native one.
   One of them corrected a false premise: `converger`/`convergir` was recorded as
   a regional split, but the DPD describes a frequency difference and no source
   documents a Spain/Latin America distribution. Each is
   structured data pinned to the sites it concerns, so answering one means
   editing the vocabulary and moving the entry to `resolvedQuestions` with a
   `Resolution` attached — do only one and the build goes red. Resolutions are
   kept rather than deleted: the vocabulary records the verdict, and this is the
   only place the argument survives.

   `resolvedQuestions` is empty, so its gates would be vacuous. They are written
   as a pure `faultsIn` in `test/dialects.test.ts`, proved against fixtures, and
   then applied to the real list — the pattern to copy for any list that starts
   empty. Neutering `faultsIn` must fail eight tests; if it does not, the
   fixtures have stopped being load-bearing.

2. **More languages are a data change, not engineering.** Add a key to every
   entry in `src/lang/registry.ts`; the gates catch anything missed.
3. **Five subpaths were placeholders once** — all now implemented. If you add a
   new entry point, wire it into `tsdown.config.ts`, the `exports` map,
   `scripts/gen-api-reference.mjs`, and `scripts/verify-package.sh`.

---

## How to work here

```sh
pnpm install        # installs deps, wires git hooks (skipped when CI is set)
pnpm check          # format, lint, typecheck, tests + coverage gate
pnpm run ci         # the above + build, package verification, docs, dialects
```

**`pnpm run ci`, never `pnpm ci`.** `ci` is a _builtin_ pnpm command — an alias
of `clean-install` — so it shadows the script entirely: it deletes
`node_modules`, reinstalls from the lockfile, runs **no checks at all**, and
exits 0. The pre-push gate that looks like it passed did nothing. `pnpm check`
has no such collision, but prefer `pnpm run` for both.

`dialects:check` is `git diff --exit-code -- src/lang`, so it reports failure
against a dirty tree. Committing first is the difference between a real drift
and your own uncommitted edit.

`gitleaks` and `convco` must be on PATH — `brew install gitleaks convco`.

**The bar is 100% coverage with no ignores.** That has held through every
change; do not be the one to add the first `v8 ignore`. If code is unreachable,
restructure it — see `retry` in `src/agent/tool.ts`, where the loop was
reshaped so the budget-exhausted `return` is a real path rather than dead code.

### Commits

Conventional Commits, enforced by a `commit-msg` hook. **One** scope, from the
allowlist in `.convco`:

```
birds  option  result  task  reader  pipe  core  types  deps  ci  build  release  repo
```

`docs` is a valid _type_, not a scope. `feat(core): …`, `docs(repo): …`.

### Branching

Feature branch → PR → squash merge. Never push to `main`. Branch protection
requires the `CI OK` check, signed commits, and linear history.

---

## Traps — things that cost real time to discover

### TypeScript 7 ships no JS compiler API

`exports['.']` is a three-line `version.cjs`. Anything doing
`import ts from 'typescript'` is dead: **TypeDoc, ts-morph, api-extractor,
dts-bundle-generator, tsd, typescript-eslint**. The API returns, differently, in
7.1. This is why the API reference is generated by an in-repo script.

### TypeScript is pinned `~7.0`, not `^7.0`

`rolldown-plugin-dts` gates its tsgo path on an exact `versionMajorMinor ===
"7.0"` compare and falls back to a package not in the graph. A single
`pnpm update` breaks declaration emit _and_ desynchronises the linter.

### The declaration pipeline has no exit code

`tsdown` spawns tsgo under `--noCheck` and resolves on `close` **without reading
the exit status**. `TS4023`/`TS2742` — exactly what deeply inferred curried
generics provoke — are suppressed. `pnpm check:dts-emit` is the real gate and
must stay a required CI job. There is also a grep asserting no exported
declaration degraded to `any`.

### tsdown exits 1 on successful builds

Unless `suppressWarnings: [/TypeScript 7\.0 does not yet have a stable API/]` is
present. `failOnWarn: false` does **not** work — inline CLI config wins the defu
merge.

### Generic scoping is THE recurring bug

> Scope each type parameter to the call signature that supplies it.

Got this wrong three times. Writing `<A, B, C>(f: (b: B) => C) => (g: (a: A) =>
B) => …` compiles and is wrong: `A` is inferable from nothing, defaults to
`unknown`, and poisons every later application.

It is **loud** in `Reader` (contravariant in `R`) and **silent** in `Result`
(covariant in `E`) — the same mistake in `Result.map` discarded the error type
on every call while all runtime tests passed. `test/adt-scoping.test-d.ts` pins
it with positive _and_ negative assertions; the positive alone passes against
the broken signature.

### Implementations never live in `index.ts`

`vitest.config.ts` excludes `src/**/index.ts` from coverage, assuming barrels.
`pipe` was written there once and vanished from the gate — 112 tests reporting
100% while a whole module was unmeasured. Barrels re-export only.

### `export * as Ns` leaks into the public API

It made rolldown build a namespace object, put it in a shared chunk, and
re-export it from `smullyan/result` as `t`. `attw` and `publint` both pass such
an export. The ADTs are therefore not re-exported from the root.

### No host APIs

`types: []` guarantees the published `.d.ts` has zero ambient dependencies.
That is why there is no `Task.delay` and why the agent layer takes an injected
`Sleep`. The constraint turned out to be a feature: backoff schedules are pure
data and exactly testable with a fake clock.

**A fake clock is role-specific.** Instant resolution is right for retry and
wrong for timeout, where it makes the deadline win every race.

---

## Generated artefacts

Never edit these; edit the source and regenerate.

| File                       | Source                 | Command            |
| -------------------------- | ---------------------- | ------------------ |
| `docs/reference/api.md`    | TSDoc in `src/`        | `pnpm docs:api`    |
| `docs/reference/aviary.md` | TSDoc in `src/birds/`  | `pnpm docs:aviary` |
| `src/lang/*/**.ts`         | `src/lang/registry.ts` | `pnpm dialects`    |

Each generator takes its **inventory from built artefacts**, not from the source
its regex reads — runtime exports from the `.mjs`, type exports from the
`.d.mts`. An undocumented export is a build failure, not a silent omission.

Generators format their own output; otherwise `format:check` and the drift check
disagree forever.

### Dialect gates

Four properties, all build failures, each verified to fail when violated:

- **total** — every concept named in every language
- **injective** — no two concepts share a name within a module
- **bijective** — globally, one foreign name ↔ one concept. Per-module
  injectivity is _not_ enough: the codemod's rename map is global, so a
  cross-module collision silently translates back to the wrong concept
- **grounded** — every concept is a real export of the built package

Plus `translate(a → b → a) ≡ identity` as a property test.

---

## Releasing

Fully automatic as of `0.4.0`. Merge to `main` → version PR → merge it →
publish with provenance. Details in `docs/RELEASING.md`.

Two things that will confuse you:

1. **The version PR gets no CI on creation.** GitHub fires no `pull_request`
   event for PRs opened with `GITHUB_TOKEN`. Close and reopen it as a user to
   trigger checks.
2. **`changesets/action` overwrites git identity.** It calls `setupGitUser()`
   internally, clobbering `user.name`/`user.email` — but _not_ signing settings.
   Identity is therefore supplied as `GIT_AUTHOR_*`/`GIT_COMMITTER_*` env vars,
   which git resolves ahead of config.

Signing uses a dedicated key in the `release-signing` **environment** secret,
invisible to any job that does not declare that environment. Rotation steps are
in `docs/RELEASING.md`.

---

## The lesson worth internalising

Repeatedly, a gate reported success for work it never performed:

| It said                            | It meant                                   |
| ---------------------------------- | ------------------------------------------ |
| "Type Errors: no errors"           | the tsconfig did not exist                 |
| "no vulnerable paths found"        | zero dependencies were scanned             |
| 100% coverage, 112 tests           | a whole module was excluded                |
| build succeeded                    | declaration diagnostics were suppressed    |
| "gitleaks found a probable secret" | gitleaks was not installed                 |
| attw + publint clean               | an internal namespace was leaking publicly |
| 4 green retry jobs                 | a CDN was failing and two jobs got lucky   |
| `pnpm ci` exited 0                 | it reinstalled deps and ran no checks      |

None were wrong _answers_. They were **absent** answers wearing a green badge.

**Before trusting a check, make it fail on purpose.** An unused
`@ts-expect-error` should produce `TS2578`. `snyk --print-deps` should list more
than the package itself. Adding a module should move the function count. That
technique found more real defects here than careful review ever did.

The corollary for retries: the final attempt must carry **no**
`continue-on-error`. A retry that cannot still fail is suppression with extra
steps, and it looks nearly identical in a diff.
