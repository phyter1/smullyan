# How this is tested

A combinator library has an unusual property: the _type_ is most of the
product. `const I = (x) => x` reaches 100% line coverage with a single
assertion and proves essentially nothing.

So there are four layers, all gated in CI.

## 1. Runtime tests — 100%, hard gate

Lines, branches, functions and statements all at 100%. The build fails below it.

One trap specific to curried code: **every arrow in the chain must actually be
invoked**. Partial application leaves the inner arrows uncovered.

```ts
// Covers only the outermost arrow.
const step = B(show);

// Covers all three.
expect(B(show)(inc)(41)).toBe('42');
```

## 2. Positive type assertions

```ts
expectTypeOf(pipe(1, inc, show)).toEqualTypeOf<string>();
```

Necessary, and **not sufficient** — see layer 3.

## 3. Negative type tests

```ts
// @ts-expect-error B expects a function, not a number
void B(42);
```

This is the layer that earns its place. A positive assertion passes just as
happily against an over-permissive signature: if a generic silently widens to
`unknown`, `toEqualTypeOf` may still succeed because the widened type is
assignable. Only an assertion that wrong usage **fails to compile** catches it.

The `Result.map` bug described in [Typing combinators](./typing-combinators)
survived every positive assertion and every runtime test. The negative form is
what pins it:

```ts
expectTypeOf(R.map(inc)(r)).not.toEqualTypeOf<R.Result<unknown, number>>();
```

::: danger This layer can pass vacuously
Vitest's typecheck mode shells out to `tsc -p <tsconfig>` **without injecting
the test files**. If that tsconfig's `include` stops matching `*.test-d.ts`,
tsc checks nothing, exits 0, and Vitest reports _"Type Errors: no errors"_ —
every negative assertion passing for free.

It happened during development. Before trusting the suite, commit a deliberately
unused `@ts-expect-error` and confirm CI goes red with `TS2578`, then revert.
:::

## 4. Algebraic laws

Property tests via fast-check, asserting the identities that relate combinators
to each other:

```
S K K   ≡ I        W K ≡ I         C (C f) ≡ f
KI      ≡ C K      T   ≡ C I       Q       ≡ C B
D2 f g g ≡ Ψ f g   C*  is its own inverse
```

Plus functor, applicative and monad laws for every ADT, and the Reader
equivalences against the independently written birds:

```
Reader.map ≡ B    Reader.ap ≡ S    Reader.flatten ≡ W    Reader.of ≡ K
```

This is where real confidence comes from. Because the birds relate to each
other, **a typo in one implementation is caught by a different bird's law** —
and two implementations written independently must agree exactly.

It also catches mistakes in the _tests_. Two law statements were written with
transposed operands during development; fast-check found both on the first
generated case. A hand-picked example would likely have passed.

## The meta-lesson: verify a check can fail

Six separate times during this project, a gate reported success for work it
never performed:

| What it said                       | What was true                                          |
| ---------------------------------- | ------------------------------------------------------ |
| "Type Errors: no errors"           | The tsconfig did not exist                             |
| "no vulnerable paths found"        | Zero dependencies were scanned                         |
| 100% coverage, 112 tests           | An entire module was excluded from coverage            |
| Build succeeded                    | Declaration diagnostics were suppressed by `--noCheck` |
| "gitleaks found a probable secret" | gitleaks was not installed                             |
| attw + publint clean               | An internal namespace was leaking into the public API  |

None were wrong _answers_. They were **absent** answers wearing a green badge.
The defence that worked was never careful config review — it was forcing each
gate to fail on demand: the unused `@ts-expect-error` canary, `snyk
--print-deps`, watching the function count after adding a module, diffing the
built package's real exports against the documented ones.

A green check you have never seen go red is an untested assertion.
