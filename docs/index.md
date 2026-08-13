---
layout: home

hero:
  name: smullyan
  text: Combinatory logic, fully typed
  tagline: The bird combinators of To Mock a Mockingbird, plus Option, Result, Task and Reader — curried, tree-shakable, and zero-dependency.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: The aviary
      link: /reference/aviary
    - theme: alt
      text: GitHub
      link: https://github.com/phyter1/smullyan

features:
  - title: Thirty-six combinators
    details: The whole forest, from the Bluebird to the Sage. Each exported under its symbol, its bird name, and its familiar FP name — B, bluebird and compose are the same function.
  - title: The types are the product
    details: isolatedDeclarations is on, so every public signature is a written artifact rather than an inference result that drifts between compiler releases. No any in published types.
  - title: Tested four ways
    details: Runtime tests at 100% coverage, expect-type assertions, @ts-expect-error negative tests, and property-based algebraic laws. Coverage says a function ran; a law says it was correct.
  - title: Honest about its limits
    details: Some identities are true at runtime but inexpressible in TypeScript. Those boundaries are asserted as compile-time facts, not buried in a comment.
  - title: Translatable
    details: Because the API is a fixed vocabulary composed positionally, only the identifiers carry language. smullyan/es/* is the same functions under Spanish names, and a codemod moves source between dialects in either direction. Experimental — not yet reviewed by a native speaker.
---

## At a glance

```ts
import { B, C, K, S, Y } from 'smullyan/birds';
import { pipe } from 'smullyan/pipe';
import * as Option from 'smullyan/option';

// Composition — the Bluebird
const incThenShow = B(String)((n: number) => n + 1);
incThenShow(41); // '42'

// Recursion without a name — the Sage bird
const factorial = Y<number, number>((rec) => (n) => (n <= 1 ? 1 : n * rec(n - 1)));
factorial(5); // 120

// Pipelines
pipe(
  Option.fromNullable(process.env.PORT),
  Option.map(Number),
  Option.filter((n: number) => Number.isInteger(n)),
  Option.getOrElse(() => 3000),
);
```

## Install

::: code-group

```sh [pnpm]
pnpm add smullyan
```

```sh [npm]
npm install smullyan
```

```sh [bun]
bun add smullyan
```

:::

## Entry points

Every module is side-effect free and independently importable, so you ship only
what you use.

| Import            | Contains                          |
| ----------------- | --------------------------------- |
| `smullyan`        | The birds, plus `pipe` and `flow` |
| `smullyan/birds`  | All thirty-six combinators        |
| `smullyan/pipe`   | `pipe` and `flow`                 |
| `smullyan/option` | `Option<A>`                       |
| `smullyan/result` | `Result<E, A>`                    |
| `smullyan/task`   | `Task<A>`, `TaskResult<E, A>`     |
| `smullyan/reader` | `Reader<R, A>`                    |

The ADTs are not re-exported from the root: each defines `map`, `flatMap`,
`match` and `getOrElse`, so they would collide. Import them by subpath.
