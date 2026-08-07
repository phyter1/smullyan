# Contributing

```sh
pnpm install     # installs deps and wires git hooks
pnpm check       # format, lint, typecheck, tests + coverage gate
pnpm ci          # the above, plus build and package verification
```

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

The API reference is generated. Do not edit `docs/reference/api.md` — edit the
TSDoc in `src/`. CI fails if the generated file is stale.
