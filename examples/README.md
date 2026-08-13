# Examples

Real programs built from the library, compiled and run by the test suite rather
than pasted into a README and left to rot.

## `weather/`

A CLI-shaped program: read configuration from the environment, validate a city
argument, fetch a reading over HTTP with retries, render it.

| File            | Written by  |
| --------------- | ----------- |
| `weather.ts`    | a person    |
| `weather.es.ts` | the codemod |

`weather.es.ts` is **generated**. Run `pnpm examples` to regenerate;
`pnpm examples:check` fails the build if the checked-in copy has drifted. Both
files are typechecked by `pnpm typecheck:examples`, and
`test/example-weather.test.ts` runs **both** and asserts they produce identical
output — including the same number of retry attempts on the failure path, since
that is where a mistranslation could plausibly agree on the answer while
diverging on behaviour.

### Why it takes its dependencies as arguments

The library uses no host APIs at all — `types: []`, so its published `.d.ts` has
zero ambient dependencies, and the retry layer takes an injected clock. A
program built from it inherits the payoff: `fetchJson` and `sleep` arrive in a
`Reader` environment, so the whole thing runs under a fake clock with no
network and no mocking library.

### What it found

The example was written to demonstrate the library. It immediately found three
defects that 292 tests and four build gates had not:

1. The codemod moved a namespace import's specifier but left its members alone,
   emitting `O.some` against a module that exports `algo` — and a test asserted
   that output as correct.
2. The rename map was global, so `fromPromise` imported from `smullyan/agent`
   was renamed to `desdePromesa`, which belongs to `task` and is not exported by
   `smullyan/es/agent`.
3. No dialect exported a single **type**, so no annotated program could be
   translated at all.

All three are fixed. The reason they survived is worth keeping in mind: the
gates check that the registry is coherent, and nothing had ever **compiled**
generated output. That is what an example is for.

### A known limit

`retrying` and `givingUpAfter` are properties of the object `withClock` returns,
and the registry translates module exports rather than property names. Spanish
agent code is therefore Spanish policy phrases passed to an English verb. The
phrases carry most of the readability, but it is a real gap.

The terse agent API — `retry`, `exponential`, `fromPromise` — is not in the
registry either, so a dialect cannot express it. The example uses the readable
dialect, which is fully translatable; that is not a coincidence, and
`pnpm examples` fails loudly rather than emitting broken code if an example
strays outside the translatable vocabulary.
