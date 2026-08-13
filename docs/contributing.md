# Contributing

```sh
pnpm install     # installs deps and wires git hooks
pnpm check       # format, lint, typecheck, tests + coverage gate
pnpm run ci      # the above, plus build and package verification
```

> [!IMPORTANT]
> `pnpm run ci`, **not** `pnpm ci`. The latter is a builtin pnpm command — an
> alias of `clean-install` — so it shadows this project's `ci` script entirely:
> it deletes `node_modules`, reinstalls from the lockfile, runs **no checks**,
> and exits 0. A green result from `pnpm ci` means nothing was verified.

You will also want `gitleaks` and `convco` on PATH — `brew install gitleaks convco`.
The pre-commit hook needs both, and it will tell you if either is missing.

## The bar

| Gate     | Threshold                                                                  |
| -------- | -------------------------------------------------------------------------- |
| Coverage | **100%** lines, branches, functions, statements — the build fails below it |
| Types    | `tsc` clean under `isolatedDeclarations` and the strictest options         |
| Lint     | `oxlint` with type-aware rules, zero warnings                              |
| Package  | `attw` + `publint` clean on all seven entry points                         |

## Adding a combinator

1. One file per bird in `src/birds/`, named after the bird.
2. A named `interface`, then an annotated `const`, then the aliases:

```ts
export interface Bluebird {
  <B, C>(f: (b: B) => C): <A>(g: (a: A) => B) => (a: A) => C;
}

export const B: Bluebird = (f) => (g) => (a) => f(g(a));
export const bluebird: Bluebird = B;
export const compose: Bluebird = B;
```

3. **Scope each type parameter to the call that supplies it.** This is the rule
   that governs every signature here; see
   [Typing combinators](./design/typing-combinators). Getting it wrong compiles
   fine and silently widens generics to `unknown`.
4. Export from `src/birds/index.ts`. Implementations never live in an
   `index.ts` — those are excluded from coverage.
5. Tests in three layers: runtime (every arrow in the curried chain must
   actually be _invoked_, or function coverage drops), type-level assertions,
   and at least one algebraic law relating it to another bird.

## Commits

Conventional Commits, enforced by a `commit-msg` hook. Allowed scopes are
declared in `.convco`:

```
birds  option  result  task  reader  pipe  core  types  deps  ci  build  release  repo
```

One scope per commit. `feat(birds): add the phoenix combinator`.

## Changesets

Any change to published behaviour needs one:

```sh
pnpm changeset
```

Pick `minor` for new exports, `patch` for fixes. The release workflow turns
accumulated changesets into a version PR.

## Docs

```sh
pnpm docs:dev     # local preview
pnpm docs:api     # regenerate the API reference from source TSDoc
pnpm docs:build   # production build, fails on dead links
```

The API reference is generated. Do not edit `docs/reference/api.md` or
`docs/reference/aviary.md` — edit the TSDoc in `src/` and run `pnpm docs:api` /
`pnpm docs:aviary`. CI fails if either generated file is stale.

## Dialects

The `smullyan/es/*` entry points are generated too. `src/lang/registry.ts` is the
single source of truth; everything under `src/lang/es/` is output.

```sh
pnpm dialects        # rebuild every dialect from the registry
pnpm dialects:check  # fail if the generated output has drifted
```

Adding a language is a data change: add a key to every entry in the vocabulary
and run `pnpm dialects`. Four properties are enforced as build failures, so an
omission is caught rather than shipped — every concept named in every language
(**total**), no two concepts sharing a name within a module (**injective**), one
foreign name per concept globally (**bijective**, because the codemod's rename
map is global and a cross-module collision would translate back to the wrong
concept), and every concept a real export of the built package (**grounded**).
`translate(a → b → a) ≡ identity` is asserted as a property test on top.

> [!NOTE]
> `dialects:check` compares the working tree, so it reports failure against
> uncommitted edits under `src/lang/` as well as genuine drift. Commit first.

### Naming questions

What the gates cannot check is whether a name reads naturally, which needs a
fluent speaker. `reviewedBy` records which dialects have had one; Spanish is
`null` and machine review is recorded separately in `machineReviewed`, so the
two can never be mistaken for each other.

Contested names live in `openQuestions`, each pinned to the sites it affects and
quoting the name currently shipped. Answering one means **both** editing the
vocabulary and moving the entry to `resolvedQuestions` with a `Resolution` —
who decided, when, why, and whether they were a native speaker. Doing only one
fails the build, and the retained rationale is the only record of why a name was
chosen once the vocabulary shows just the verdict.
