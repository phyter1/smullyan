# Currying and composition

Every combinator in `smullyan` is curried and takes exactly one argument at a
time. There is no `B(f, g, x)`.

```ts
B(show)(inc)(41); // '42'
B(show, inc, 41); // type error
```

This page explains why, because the decision is not obvious and it has a real
cost.

## The case for currying

**Partial application is the point.** `B(show)` is a useful value: a function
awaiting something to compose with. In an all-at-once API you would have to
write `(g) => B(show, g)` to get it back.

**It matches the mathematics.** `B f g x = f (g x)` in combinatory logic _is_
three successive applications. The curried form is the faithful translation.

**Inference stays exact.** This is the practical argument, and it is the
strongest.

## Why not both

The obvious accommodation is overloads:

```ts
export function B<A, B, C>(f: (b: B) => C): (g: (a: A) => B) => (a: A) => C;
export function B<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C;
export function B<A, B, C>(f: (b: B) => C, g: (a: A) => B, a: A): C;
```

TypeScript resolves overloads by picking the **first signature that matches**,
not the best one. In a partially-applied position with several candidates, it
frequently settles on one that widens your generics to `unknown`.

The failure is quiet. `expectTypeOf` assertions still pass, because `unknown`
satisfies plenty of them. You discover it when a consumer's inference collapses
two calls downstream.

A single call signature removes the failure mode by construction rather than
testing for it. That is why fp-ts's `pipe` is a hand-written overload chain
while its combinators are not — and why this library made the same split.

## Where overloads _are_ correct

`pipe` and `flow` are variadic by nature. There is no single signature to write,
so they carry hand-written overload chains to twenty arities:

```ts
pipe(1, inc, show, len); // string -> number, inferred exactly
```

Variadic tuple types can express "a chain where each output feeds the next", but
inference through them degrades badly — intermediate positions widen and the
errors become unreadable. The chains are generated mechanically rather than
transcribed by hand.

## Composing, in four directions

```ts
import { B, Q, B1, B3 } from 'smullyan/birds';
import { pipe, flow } from 'smullyan/pipe';

B(show)(inc)(41); // right to left  — compose
Q(inc)(show)(41); // left to right  — pipe
pipe(41, inc, show); // left to right, value first
flow(inc, show)(41); // left to right, no value yet
```

`B` and `Q` are the same operation with the arguments flipped — `Q ≡ C B`,
asserted in the law suite.

For functions of more than one argument, reach deeper into the aviary:

```ts
B1(show)(add)(40)(2); // Blackbird — compose onto a binary function
B2(show)(add3)(20)(20)(2); // Bunting   — onto a ternary one
B3(show)(dbl)(inc)(20); // Becard    — three-way composition
```

## Reading point-free code

Point-free style is a tool, not a virtue. These are equivalent:

```ts
const f = B(show)(inc);
const g = (n: number) => show(inc(n));
```

The second is clearer in isolation. The first composes further without naming
an intermediate, which pays off inside a `pipe` and nowhere else. Use whichever
makes the call site read better; the library has no opinion beyond that.
