---
'smullyan': minor
---

Add translatable dialects. `smullyan/es/*` exposes the whole library under
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
