# pipe and flow

```ts
import { pipe, flow } from 'smullyan/pipe';
```

Both apply functions left to right. `pipe` starts from a value; `flow` builds a
function.

```ts
pipe(41, inc, show); // '42'
flow(inc, show)(41); // '42'
```

## The difference

`flow`'s **first** function may take any number of arguments — everything after
it is unary, because it receives the previous result:

```ts
const add = (a: number, b: number): number => a + b;
flow(add, show)(40, 2); // '42'
```

`pipe` always begins with exactly one value, so its functions are all unary.

## Arity and inference

Both carry hand-written overload chains supporting **twenty** functions, with
exact inference at every step:

```ts
pipe(1, inc, dbl, inc, dbl, show, len); // number, inferred precisely
```

Beyond twenty, nest a second `pipe`.

::: info Why overloads here and nowhere else
Combinators are curried and single-signature _precisely_ to avoid overload
resolution widening generics to `unknown` — see
[Currying](../guide/currying#why-not-both).

`pipe` and `flow` are variadic by nature, so there is no single signature to
write. Variadic tuple types can express the chain, but inference through them
degrades badly: intermediate positions widen and errors become unreadable. The
chains are generated mechanically rather than transcribed by hand.
:::

## Relationship to the birds

`pipe` and `flow` are the Thrush and the Queer bird iterated, which the law
suite asserts directly:

```ts
pipe(x, f, g) === B(g)(f)(x); // Bluebird, right to left
pipe(x, f, g) === Q(f)(g)(x); // Queer bird, left to right
flow(f, g)(x) === pipe(x, f, g);
```

For a single function, `pipe(x, f)` is exactly the Thrush: `T(x)(f)`.

## With the ADTs

Because every ADT combinator is data-last, they drop straight in:

```ts
import * as Option from 'smullyan/option';

pipe(
  Option.fromNullable(process.env.PORT),
  Option.map(Number),
  Option.filter((n: number) => Number.isInteger(n)),
  Option.getOrElse(() => 3000),
);
```

This is the reason for the data-last convention: the value being transformed
arrives last, so partial application produces exactly the unary functions
`pipe` wants.
