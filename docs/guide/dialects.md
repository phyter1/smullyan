# Dialects

The same library, under names in another language. `smullyan/es/option` exports
`algo` and `mapear`; they **are** `some` and `map`, not wrappers around them.

::: warning Experimental
Non-English dialects are generated from a translation table and have not been
reviewed by a native speaker. The names may change. See
[the design note](/design/dialects) for exactly what has and has not been
checked.
:::

## Why this is possible here

Most libraries cannot be translated. Method chains, string DSLs and
configuration keys all put language inside the structure of a program, so
renaming the identifiers leaves a half-translated hybrid.

This library has none of that. The entire API is a fixed vocabulary composed
positionally, so **only the identifiers carry language**. Translate those and
the program reads as prose on the other side, because nothing else had to move.

```ts
// Spanish
encadenar(
  algo(20),
  mapear(incrementar),
  obtenerODefecto(() => 0),
);

// English — the same program, mechanically derived
pipe(
  some(20),
  map(increment),
  getOrElse(() => 0),
);
```

## Using a dialect

Import from the language subpath instead of the root one. Every entry point has
a Spanish twin:

| English           | Spanish              |
| ----------------- | -------------------- |
| `smullyan/birds`  | `smullyan/es/birds`  |
| `smullyan/pipe`   | `smullyan/es/pipe`   |
| `smullyan/option` | `smullyan/es/option` |
| `smullyan/result` | `smullyan/es/result` |
| `smullyan/task`   | `smullyan/es/task`   |
| `smullyan/reader` | `smullyan/es/reader` |
| `smullyan/agent`  | `smullyan/es/agent`  |

```ts
import { algo, mapear, obtenerODefecto } from 'smullyan/es/option';
import { encadenar } from 'smullyan/es/pipe';

encadenar(
  algo(20),
  mapear((n: number) => n + 1),
  obtenerODefecto(() => 0),
); // 21
```

The dialect modules are alias re-exports, so they tree-shake identically and
add nothing to your bundle. `Es.mapear === O.map` is literally true.

## What is not translated

Three things stay universal, deliberately:

- **Bird names** — `bluebird`, `cardinal`, `phoenix`. These are proper nouns
  from a specific book, like "Fourier transform". They are also regionally
  unstable, so a translation would be less reliable than the original.
- **Symbols** — `B`, `C`, `K`, `S`. Notation, not words.
- **Module paths** — `smullyan/es/option`, not `smullyan/es/opcion`. Translating
  the path multiplies the exports map without changing how the _code_ reads,
  which is where the value is.

## Where a dialect earns its keep

Anywhere the names exist to be read aloud. The agent layer is the clearest case,
because its phrasing is the point:

```ts
import { conReloj, hasta, ignorandoAlServidor } from 'smullyan/es/agent';

const { retrying } = conReloj(relojDelSistema);

retrying(hasta(3).attempts, ignorandoAlServidor);
```

The policy phrases read as Spanish rather than as English structure wearing
Spanish labels, which is the only reason to have a dialect at all.

::: info A known limit
`retrying` and `givingUpAfter` are **properties of the object** `conReloj`
returns, and the registry translates module exports rather than property names.
So agent code in a dialect is currently mixed: Spanish policy phrases passed to
an English verb. The phrases carry most of the readability — they are what a
reviewer reads aloud — but this is a genuine gap rather than a design decision,
and worth knowing before you lean on it.
:::

## Translating existing code

`scripts/translate.mjs` rewrites a source file from one dialect to another. It
is deliberately narrow: it rewrites **imported identifiers and module
specifiers only**.

```sh
# Print the translation to stdout
node scripts/translate.mjs --from en --to es src/app.ts

# Or rewrite the files in place
node scripts/translate.mjs --from en --to es --write src/**/*.ts
```

Everything else is left alone, which matters more than it sounds:

```ts
// Before
import { some, map, filter } from 'smullyan/option';
const doubled = [1, 2, 3].map((n) => n * 2); // Array#map — not ours
const config = { map: 'not ours', filter: true }; // object keys — not ours

// After
import { algo, mapear, filtrar } from 'smullyan/es/option';
const doubled = [1, 2, 3].map((n) => n * 2); // untouched
const config = { map: 'not ours', filter: true }; // untouched
```

A blanket find-and-replace would corrupt both of those. Local aliases survive
too — `import { map as transform }` becomes `import { mapear as transform }`,
and every use of `transform` is left as written.

### It round-trips exactly

`translate(a → b → a)` is the identity, asserted as a property test over
generated programs rather than assumed. That property is what makes the codemod
safe to run on code you care about: nothing is lost in either direction.

## Adding a language

A data change, not an engineering one. Add a key to every entry in
`src/lang/registry.ts` and run `pnpm dialects`. Four build-time gates catch
anything you miss — they are described in
[the design note](/design/dialects), along with the one property they cannot
check.
