# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

Every user-facing change needs a changeset. From the repo root:

```sh
pnpm changeset
```

Pick the bump type and describe the change in one or two sentences — the text
lands verbatim in `CHANGELOG.md` and in the GitHub release notes.

- `patch` — bug fix, doc fix, or a purely internal change that ships in the tarball.
- `minor` — new combinator, new ADT method, new subpath export.
- `major` — any change to an exported *type* that can break inference in user code.
  Because the `.d.ts` files are the product, a type-level breaking change is a
  major bump even when the runtime behaviour is identical.

On merge to `main`, the release workflow opens (or updates) a "Version Packages"
PR. Merging that PR publishes to npm via trusted publishing (OIDC) — no tokens.
