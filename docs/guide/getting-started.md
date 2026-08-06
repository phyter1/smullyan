# Getting started

## Install

::: code-group

```sh [pnpm]
pnpm add smullyan
```

```sh [npm]
npm install smullyan
```

:::

`smullyan` has **zero runtime dependencies**, ships ESM and CJS, and is
side-effect free, so unused combinators are removed by any modern bundler.

## Requirements

|                   |                                                                         |
| ----------------- | ----------------------------------------------------------------------- |
| TypeScript        | 5.0+ to consume. The library itself is built with 7.0.                  |
| Node              | >= 22.14.0 (`engines`), though nothing here touches a Node API.         |
| Module resolution | `node16`, `nodenext` or `bundler`. `node10` cannot see subpath exports. |

## Your first combinator

```ts
import { B } from 'smullyan/birds';

const inc = (n: number): number => n + 1;
const show = (n: number): string => String(n);

const incThenShow = B(show)(inc);
incThenShow(41); // '42'
```

`B` is the **Bluebird**, and it is ordinary right-to-left composition. If that
name is unhelpful to you, two aliases point at the identical function:

```ts
import { bluebird, compose } from 'smullyan/birds';

compose(show)(inc)(41); // '42' — same function, different dialect
```

Pick whichever reads best in your codebase. They are `const` aliases of one
implementation, so they tree-shake identically and cost nothing at runtime.

## Everything is curried

There is no `B(f, g, x)` form. Every combinator takes one argument at a time:

```ts
B(show)(inc)(41);
```

That is the faithful combinatory form, and partial application is the entire
point of these functions — `B(show)` is a useful value on its own. It also
keeps inference exact; see [Currying and composition](./currying) for why the
all-at-once form was deliberately not provided.

## Pipelines

```ts
import { pipe, flow } from 'smullyan/pipe';

pipe(41, inc, show); // '42'

const incThenShow = flow(inc, show);
incThenShow(41); // '42'
```

`pipe` threads a value left to right. `flow` composes functions without a value
yet, and its first function may take any number of arguments:

```ts
const add = (a: number, b: number): number => a + b;
flow(add, show)(40, 2); // '42'
```

Both support up to twenty functions with exact inference at every arity.

## Handling absence and failure

```ts
import * as Option from 'smullyan/option';
import * as Result from 'smullyan/result';
import { pipe } from 'smullyan/pipe';

const port = pipe(
  Option.fromNullable(process.env.PORT),
  Option.map(Number),
  Option.filter((n: number) => Number.isInteger(n)),
  Option.getOrElse(() => 3000),
);

const parsed = Result.fromThrowable(
  () => JSON.parse(input) as unknown,
  (e) => (e instanceof Error ? e.message : 'unknown parse failure'),
);
```

Both are plain discriminated unions, so they narrow with a bare `switch` even
if you never touch a helper:

```ts
const o = Option.some(42);
if (o._tag === 'Some') o.value; // narrowed to number
```

See [Working with Option and Result](./option-result).

## Where to go next

- **[Why birds](./why-birds)** — what the names mean and why they are worth learning
- **[The aviary](../reference/aviary)** — every combinator, with definitions
- **[Typing combinators](../design/typing-combinators)** — the one rule that
  governs every signature in the library
