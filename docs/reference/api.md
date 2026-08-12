---
# GENERATED FILE — DO NOT EDIT.
# Run `pnpm docs:api` to regenerate. Source of truth is the TSDoc in src/.
outline: [2, 3]
---

# API reference

Generated from the TSDoc in `src/`, with the export inventory read from the
**built package** at runtime — so anything exported but undocumented fails the
build rather than quietly going missing.

::: info Why not TypeDoc
TypeDoc is built on the TypeScript compiler API, and TypeScript 7.0 does not
ship one — its package `exports` maps `"."` to a three-line `version.cjs`.
TypeDoc's peer range tops out at `6.0.x`. The same constraint rules out
ts-morph, api-extractor and tsd. TypeScript 7.1 is expected to ship a new API;
this generator can be retired then.
:::

## `smullyan/birds`

| Export | Kind | Summary |
| --- | --- | --- |
| [`ap`](#ap) | const | Reader applicative application. |
| [`apply`](#apply) | const | Explicit function application. |
| [`applyTo`](#applyto) | const | Apply a function to a value, value first. |
| [`B`](#b) | const | Compose two functions, right to left. |
| [`B1`](#b1) | const | Compose a unary function onto a curried binary one. |
| [`B2`](#b2) | const | Compose a unary function onto a curried ternary one. |
| [`B3`](#b3) | const | Compose three functions right to left. |
| [`becard`](#becard) | const | The Becard, by name. |
| [`Becard`](#becard) | interface | The Becard — `B3`. |
| [`blackbird`](#blackbird) | const | The Blackbird, by name. |
| [`Blackbird`](#blackbird) | interface | The Blackbird — `B1`. |
| [`bluebird`](#bluebird) | const | The Bluebird, by name. |
| [`Bluebird`](#bluebird) | interface | The Bluebird — `B`. |
| [`bunting`](#bunting) | const | The Bunting, by name. |
| [`Bunting`](#bunting) | interface | The Bunting — `B2`. |
| [`C`](#c) | const | Flip the argument order of a curried binary function. |
| [`cardinal`](#cardinal) | const | The Cardinal, by name. |
| [`Cardinal`](#cardinal) | interface | The Cardinal — `C`. |
| [`cardinalOnceRemoved`](#cardinalonceremoved) | const | The Cardinal once removed, by name. |
| [`CardinalOnceRemoved`](#cardinalonceremoved) | interface | The Cardinal once removed — `C*`. |
| [`compose`](#compose) | const | Right-to-left function composition. |
| [`compose2`](#compose2) | const | Compose onto a binary function. |
| [`compose3`](#compose3) | const | Three-way right-to-left composition. |
| [`constant`](#constant) | const | The constant function. |
| [`converge`](#converge) | const | Converge two functions on one value. |
| [`CStar`](#cstar) | const | Flip the last two arguments of a curried ternary function. |
| [`D`](#d) | const | Apply a binary function with its second argument pre-processed. |
| [`D1`](#d1) | const | Apply a ternary function with its third argument pre-processed. |
| [`D2`](#d2) | const | Combine two values, each transformed by its own function. |
| [`dickcissel`](#dickcissel) | const | The Dickcissel, by name. |
| [`Dickcissel`](#dickcissel) | interface | The Dickcissel — `D1`. |
| [`dove`](#dove) | const | The Dove, by name. |
| [`Dove`](#dove) | interface | The Dove — `D`. |
| [`dovekies`](#dovekies) | const | The Dovekies, by name. |
| [`Dovekies`](#dovekies) | interface | The Dovekies — `D2`. |
| [`duplicate`](#duplicate) | const | Apply a curried binary function to the same argument twice. |
| [`E`](#e) | const | Apply a binary function whose second argument comes from another binary function. |
| [`eagle`](#eagle) | const | The Eagle, by name. |
| [`Eagle`](#eagle) | interface | The Eagle — `E`. |
| [`F`](#f) | const | Hold two values and apply a function to them reversed. |
| [`finch`](#finch) | const | The Finch, by name. |
| [`Finch`](#finch) | interface | The Finch — `F`. |
| [`fix`](#fix) | const | The fixed-point combinator. |
| [`flip`](#flip) | const | Flip a curried binary function's argument order. |
| [`G`](#g) | const | Combine an untouched argument with a transformed one, crosswise. |
| [`goldfinch`](#goldfinch) | const | The Goldfinch, by name. |
| [`Goldfinch`](#goldfinch) | interface | The Goldfinch — `G`. |
| [`H`](#h) | const | Apply a ternary function with its first argument reused as the third. |
| [`hummingbird`](#hummingbird) | const | The Hummingbird, by name. |
| [`Hummingbird`](#hummingbird) | interface | The Hummingbird — `H`. |
| [`I`](#i) | const | Return the argument unchanged. |
| [`identity`](#identity) | const | The identity function. |
| [`idiot`](#idiot) | const | The Idiot, by name. |
| [`Idiot`](#idiot) | interface | The Idiot — `I`. |
| [`idiotOnceRemoved`](#idiotonceremoved) | const | The Idiot once removed, by name. |
| [`IdiotOnceRemoved`](#idiotonceremoved) | interface | The Idiot once removed — `I*`. |
| [`IStar`](#istar) | const | Apply a function to a value. |
| [`J`](#j) | const | Apply a binary accumulating function twice, nested. |
| [`jay`](#jay) | const | The Jay, by name. |
| [`Jay`](#jay) | interface | The Jay — `J`. |
| [`K`](#k) | const | Produce a function that ignores its argument and always returns `a`. |
| [`kestrel`](#kestrel) | const | The Kestrel, by name. |
| [`Kestrel`](#kestrel) | interface | The Kestrel — `K`. |
| [`KI`](#ki) | const | Produce a function that ignores the first argument and returns the second. |
| [`kite`](#kite) | const | The Kite, by name. |
| [`Kite`](#kite) | interface | The Kite — `KI`. |
| [`L`](#l) | const | Self-apply the second argument, then pass the result to the first. |
| [`lark`](#lark) | const | The Lark, by name. |
| [`Lark`](#lark) | interface | The Lark — `L`. |
| [`M`](#m) | const | Apply a function to itself. |
| [`mockingbird`](#mockingbird) | const | The Mockingbird, by name. |
| [`Mockingbird`](#mockingbird) | interface | The Mockingbird — `M`. |
| [`O`](#o) | const | Apply `f` to `g`, then `g` to the result. |
| [`on`](#on) | const | Combine two values on a shared projection. |
| [`owl`](#owl) | const | The Owl, by name. |
| [`Owl`](#owl) | interface | The Owl — `O`. |
| [`P`](#p) | const | The Psi bird, by symbol. |
| [`pair`](#pair) | const | Church-encoded pair. |
| [`Phi`](#phi) | const | The Phoenix, by symbol. |
| [`phoenix`](#phoenix) | const | Apply two functions to one value and combine the results. |
| [`Phoenix`](#phoenix) | interface | The Phoenix — `Φ`. |
| [`pipe2`](#pipe2) | const | Left-to-right composition. |
| [`psi`](#psi) | const | Combine two values after mapping both through the same function. |
| [`Psi`](#psi) | interface | The Psi bird — `Ψ`. |
| [`Q`](#q) | const | Compose two functions left to right. |
| [`Q1`](#q1) | const | Apply `x` to `g`, then `f` to the result. |
| [`Q2`](#q2) | const | Apply `x` to `f`, then `g` to the result. |
| [`Q3`](#q3) | const | Apply `f` to `g`, then `x` to the result. |
| [`Q4`](#q4) | const | Apply `g` to `f`, then `x` to the result. |
| [`quacky`](#quacky) | const | The Quacky bird, by name. |
| [`Quacky`](#quacky) | interface | The Quacky bird — `Q4`. |
| [`queer`](#queer) | const | The Queer bird, by name. |
| [`Queer`](#queer) | interface | The Queer bird — `Q`. |
| [`quirky`](#quirky) | const | The Quirky bird, by name. |
| [`Quirky`](#quirky) | interface | The Quirky bird — `Q3`. |
| [`quixotic`](#quixotic) | const | The Quixotic bird, by name. |
| [`Quixotic`](#quixotic) | interface | The Quixotic bird — `Q1`. |
| [`quizzical`](#quizzical) | const | The Quizzical bird, by name. |
| [`Quizzical`](#quizzical) | interface | The Quizzical bird — `Q2`. |
| [`R`](#r) | const | Apply a binary function to arguments supplied out of order. |
| [`robin`](#robin) | const | The Robin, by name. |
| [`Robin`](#robin) | interface | The Robin — `R`. |
| [`S`](#s) | const | Apply `f` and `g` to the same argument, then apply the results. |
| [`sage`](#sage) | const | The Sage bird, by name. |
| [`Sage`](#sage) | interface | The Sage bird — `Y`. |
| [`SageSelf`](#sageself) | interface | The self-applicable shape used by the Sage bird's fixed-point construction. |
| [`SelfApplicable`](#selfapplicable) | interface | Recursive types for the hard forest. |
| [`starling`](#starling) | const | The Starling, by name. |
| [`Starling`](#starling) | interface | The Starling — `S`. |
| [`T`](#t) | const | Apply a function to a value, value first. |
| [`thrush`](#thrush) | const | The Thrush, by name. |
| [`Thrush`](#thrush) | interface | The Thrush — `T`. |
| [`turing`](#turing) | const | The Turing bird, by name. |
| [`Turing`](#turing) | interface | The Turing bird — `U`. |
| [`TuringSelf`](#turingself) | interface | The self-applicable shape used by the Turing bird, whose self-application is followed by a further argument. |
| [`U`](#u) | const | The Turing bird. |
| [`V`](#v) | const | Build a pair as a function awaiting its consumer. |
| [`vireo`](#vireo) | const | The Vireo, by name. |
| [`Vireo`](#vireo) | interface | The Vireo — `V`. |
| [`W`](#w) | const | Apply a curried binary function to the same argument twice. |
| [`warbler`](#warbler) | const | The Warbler, by name. |
| [`Warbler`](#warbler) | interface | The Warbler — `W`. |
| [`warblerOnceRemoved`](#warbleronceremoved) | const | The Warbler once removed, by name. |
| [`WarblerOnceRemoved`](#warbleronceremoved) | interface | The Warbler once removed — `W*`. |
| [`WStar`](#wstar) | const | Apply a ternary function with its second argument duplicated into the third. |
| [`Y`](#y) | const | Compute the fixed point of `f`, giving a recursive function with no name. |

### ap

```ts
const ap: Starling
```

Reader applicative application. Identical to {@link S}.

<sup>Source: [`src/birds/starling.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/starling.ts)</sup>

### apply

```ts
const apply: IdiotOnceRemoved
```

Explicit function application. Identical to {@link IStar}.

<sup>Source: [`src/birds/idiot-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot-once-removed.ts)</sup>

### applyTo

```ts
const applyTo: Thrush
```

Apply a function to a value, value first. Identical to {@link T}.

<sup>Source: [`src/birds/thrush.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/thrush.ts)</sup>

### B

```ts
const B: Bluebird
```

Compose two functions, right to left.

@example
```ts
import { B } from 'smullyan/birds'

const inc = (n: number): number => n + 1
const show = (n: number): string => String(n)

const incThenShow = B(show)(inc)
incThenShow(1) // '2'
```

<sup>Source: [`src/birds/bluebird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/bluebird.ts)</sup>

### B1

```ts
const B1: Blackbird
```

Compose a unary function onto a curried binary one.

@example
```ts
import { B1 } from 'smullyan/birds'

const add = (a: number) => (b: number): number => a + b
const show = (n: number): string => String(n)

const addThenShow = B1(show)(add)
addThenShow(40)(2) // '42'
```

<sup>Source: [`src/birds/blackbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/blackbird.ts)</sup>

### B2

```ts
const B2: Bunting
```

Compose a unary function onto a curried ternary one.

@example
```ts
import { B2 } from 'smullyan/birds'

const add3 = (a: number) => (b: number) => (c: number): number => a + b + c
const show = (n: number): string => String(n)

B2(show)(add3)(20)(20)(2) // '42'
```

<sup>Source: [`src/birds/bunting.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/bunting.ts)</sup>

### B3

```ts
const B3: Becard
```

Compose three functions right to left.

@example
```ts
import { B3 } from 'smullyan/birds'

const inc = (n: number): number => n + 1
const dbl = (n: number): number => n * 2
const show = (n: number): string => String(n)

B3(show)(dbl)(inc)(20) // '42'
```

<sup>Source: [`src/birds/becard.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/becard.ts)</sup>

### becard

```ts
const becard: Becard
```

The Becard, by name. Identical to {@link B3}.

<sup>Source: [`src/birds/becard.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/becard.ts)</sup>

### Becard

```ts
interface Becard {
  <C, D>(f: (c: C) => D): <B>(g: (b: B) => C) => <A>(h: (a: A) => B) => (a: A) => D;
}
```

The Becard — `B3`.

```text
B3 f g h x = f (g (h x))
```

Three-way right-to-left composition. `B3 ≡ B (B B) B`, though — as with the
Blackbird — that derivation is not typeable in TypeScript. The law suite
asserts the rank-1 equivalent `B3 f g h ≡ B (B f g) h`.

<sup>Source: [`src/birds/becard.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/becard.ts)</sup>

### blackbird

```ts
const blackbird: Blackbird
```

The Blackbird, by name. Identical to {@link B1}.

<sup>Source: [`src/birds/blackbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/blackbird.ts)</sup>

### Blackbird

```ts
interface Blackbird {
  <C, D>(f: (c: C) => D): <A, B>(g: (a: A) => (b: B) => C) => (a: A) => (b: B) => D;
}
```

The Blackbird — `B1`.

```text
B1 f g x y = f (g x y)
```

Composition that reaches over a two-argument function. Where the Bluebird
composes onto a unary function, the Blackbird composes onto a binary one.

The classical derivation is `B1 ≡ B B B`, and it holds at runtime — but it
is NOT expressible in TypeScript. Passing `B` to itself requires
instantiating a generic combinator at a polytype, i.e. higher-rank
polymorphism, which TypeScript does not have. Explicit type arguments do not
rescue it either; the compiler reports that "'B' could be instantiated with
an arbitrary type which could be unrelated to 'number'".

That boundary is asserted as a compile-time fact in
`test/birds.negative.test-d.ts`, so if a future TypeScript release gains the
expressiveness, the test fails loudly and this note can be revisited. The
law suite asserts the rank-1 equivalent instead: `B1 f g x ≡ B f (g x)`.

Useful whenever you want to post-process a binary operation without
rewrapping it — `B1(not)(equals)` is `notEquals`.

<sup>Source: [`src/birds/blackbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/blackbird.ts)</sup>

### bluebird

```ts
const bluebird: Bluebird
```

The Bluebird, by name. Identical to {@link B}.

<sup>Source: [`src/birds/bluebird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/bluebird.ts)</sup>

### Bluebird

```ts
interface Bluebird {
  <B, C>(f: (b: B) => C): <A>(g: (a: A) => B) => (a: A) => C;
}
```

The Bluebird — `B`.

```text
B f g x = f (g x)
```

Function composition. Smullyan's Bluebird is the combinator that lets one
bird's response become another's call, and it is the backbone of the whole
forest: `B` plus `C` (Cardinal) plus `W` (Warbler) plus `K` (Kestrel) is a
basis for all of combinatory logic.

Authoring pattern — every combinator in this library follows it:

  1. A named `interface` declaring the call signature.
  2. An annotated `const` implementing it.
  3. Alias `const`s for the bird name and the familiar FP name.

The interface exists because `isolatedDeclarations` is enabled for `src/`,
which requires every exported binding to carry a syntactically-derivable
type. That turns the public type surface into a written artifact rather than
an inference result that can drift between compiler releases.

CAVEAT, and it is a real one: nothing checks that the interface AGREES with
the implementation beyond assignability. An interface declared WIDER than
the implementation compiles and ships. The property-based law suite is the
only net, which is why every law must exercise the exported `const` and
never an internal helper.

GENERIC SCOPING — the rule every combinator here must follow:

Each type parameter belongs on the call signature that SUPPLIES it, never
on an earlier one. Writing the signature as

  &lt;A, B, C>(f: (b: B) => C): (g: (a: A) => B) => (a: A) => C

compiles fine and is wrong: `A` appears nowhere in `f`, so at the first call
TypeScript has nothing to infer it from and silently defaults it to
`unknown`. Every later application then fails with "Type 'unknown' is not
assignable to type 'number'". Scoping `A` to the second call fixes it.

This is the single most common way a curried combinator's typings go wrong,
and positive `expectTypeOf` assertions alone will not always reveal it —
which is why the negative `@ts-expect-error` suite exists.

<sup>Source: [`src/birds/bluebird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/bluebird.ts)</sup>

### bunting

```ts
const bunting: Bunting
```

The Bunting, by name. Identical to {@link B2}.

<sup>Source: [`src/birds/bunting.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/bunting.ts)</sup>

### Bunting

```ts
interface Bunting {
  <D, E>(
    f: (d: D) => E,
  ): <A, B, C>(g: (a: A) => (b: B) => (c: C) => D) => (a: A) => (b: B) => (c: C) => E;
}
```

The Bunting — `B2`.

```text
B2 f g x y z = f (g x y z)
```

The Blackbird's bigger sibling: compose a unary function onto a curried
TERNARY one. Where `B` reaches over one argument and `B1` over two, `B2`
reaches over three.

<sup>Source: [`src/birds/bunting.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/bunting.ts)</sup>

### C

```ts
const C: Cardinal
```

Flip the argument order of a curried binary function.

@example
```ts
import { C } from 'smullyan/birds'

const concat = (a: string) => (b: string): string => a + b
concat('foo')('bar') // 'foobar'

const flipped = C(concat)
flipped('foo')('bar') // 'barfoo'
```

<sup>Source: [`src/birds/cardinal.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/cardinal.ts)</sup>

### cardinal

```ts
const cardinal: Cardinal
```

The Cardinal, by name. Identical to {@link C}.

<sup>Source: [`src/birds/cardinal.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/cardinal.ts)</sup>

### Cardinal

```ts
interface Cardinal {
  <A, B, C>(f: (a: A) => (b: B) => C): (b: B) => (a: A) => C;
}
```

The Cardinal — `C`.

```text
C f x y = f y x
```

Argument flipping. The Cardinal takes a curried two-argument function and
returns one that expects its arguments in the opposite order.

The Cardinal is its own inverse — `C (C f) ≡ f` — which is asserted as a
property in the law suite. Together with the Bluebird and the Warbler it
forms the BCKW basis, one of the classical alternatives to SKI.

Note the generic scoping: `A` and `B` are both recoverable from `f`, so both
belong on the first call signature. Only the result type flows through
unchanged. Contrast the Bluebird, where `A` is invisible at the first call
and must be deferred to the second.

<sup>Source: [`src/birds/cardinal.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/cardinal.ts)</sup>

### cardinalOnceRemoved

```ts
const cardinalOnceRemoved: CardinalOnceRemoved
```

The Cardinal once removed, by name. Identical to {@link CStar}.

<sup>Source: [`src/birds/cardinal-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/cardinal-once-removed.ts)</sup>

### CardinalOnceRemoved

```ts
interface CardinalOnceRemoved {
  <A, B, C, D>(f: (a: A) => (c: C) => (b: B) => D): (a: A) => (b: B) => (c: C) => D;
}
```

The Cardinal once removed — `C*`.

```text
C* f x y z = f x z y
```

The Cardinal shifted one argument deeper: the first argument passes through
and the LAST TWO are exchanged. `C* ≡ B C`, asserted in the law suite. Like
the Cardinal, it is its own inverse.

<sup>Source: [`src/birds/cardinal-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/cardinal-once-removed.ts)</sup>

### compose

```ts
const compose: Bluebird
```

Right-to-left function composition. Identical to {@link B}.

<sup>Source: [`src/birds/bluebird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/bluebird.ts)</sup>

### compose2

```ts
const compose2: Blackbird
```

Compose onto a binary function. Identical to {@link B1}.

<sup>Source: [`src/birds/blackbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/blackbird.ts)</sup>

### compose3

```ts
const compose3: Becard
```

Three-way right-to-left composition. Identical to {@link B3}.

<sup>Source: [`src/birds/becard.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/becard.ts)</sup>

### constant

```ts
const constant: Kestrel
```

The constant function. Identical to {@link K}.

<sup>Source: [`src/birds/kestrel.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/kestrel.ts)</sup>

### converge

```ts
const converge: Phoenix
```

Converge two functions on one value. Identical to {@link phoenix}.

<sup>Source: [`src/birds/phoenix.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/phoenix.ts)</sup>

### CStar

```ts
const CStar: CardinalOnceRemoved
```

Flip the last two arguments of a curried ternary function.

@example
```ts
import { CStar } from 'smullyan/birds'

const triple = (a: string) => (b: string) => (c: string): string => a + b + c
CStar(triple)('x')('y')('z') // 'x' + 'z' + 'y'
```

<sup>Source: [`src/birds/cardinal-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/cardinal-once-removed.ts)</sup>

### D

```ts
const D: Dove
```

Apply a binary function with its second argument pre-processed.

@example
```ts
import { D } from 'smullyan/birds'

const add = (a: number) => (b: number): number => a + b
const len = (s: string): number => s.length

D(add)(39)(len)('abc') // 42
```

<sup>Source: [`src/birds/dove.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dove.ts)</sup>

### D1

```ts
const D1: Dickcissel
```

Apply a ternary function with its third argument pre-processed.

<sup>Source: [`src/birds/dickcissel.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dickcissel.ts)</sup>

### D2

```ts
const D2: Dovekies
```

Combine two values, each transformed by its own function.

@example
```ts
import { D2 } from 'smullyan/birds'

const add = (a: number) => (b: number): number => a + b
const len = (s: string): number => s.length
const inc = (n: number): number => n + 1

D2(add)(len)('abc')(inc)(38) // 3 + 39
```

<sup>Source: [`src/birds/dovekies.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dovekies.ts)</sup>

### dickcissel

```ts
const dickcissel: Dickcissel
```

The Dickcissel, by name. Identical to {@link D1}.

<sup>Source: [`src/birds/dickcissel.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dickcissel.ts)</sup>

### Dickcissel

```ts
interface Dickcissel {
  <X, Y, R, S>(
    f: (x: X) => (y: Y) => (r: R) => S,
  ): (x: X) => (y: Y) => <Z>(g: (z: Z) => R) => (z: Z) => S;
}
```

The Dickcissel — `D1`.

```text
D1 f x y g z = f x y (g z)
```

The Dove one argument deeper: apply a curried TERNARY function, transforming
only its third argument.

<sup>Source: [`src/birds/dickcissel.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dickcissel.ts)</sup>

### dove

```ts
const dove: Dove
```

The Dove, by name. Identical to {@link D}.

<sup>Source: [`src/birds/dove.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dove.ts)</sup>

### Dove

```ts
interface Dove {
  <X, R, S>(f: (x: X) => (r: R) => S): (x: X) => <Y>(g: (y: Y) => R) => (y: Y) => S;
}
```

The Dove — `D`.

```text
D f x g y = f x (g y)
```

Apply a binary function, transforming only the SECOND argument. `D ≡ B B`,
asserted in the law suite.

<sup>Source: [`src/birds/dove.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dove.ts)</sup>

### dovekies

```ts
const dovekies: Dovekies
```

The Dovekies, by name. Identical to {@link D2}.

<sup>Source: [`src/birds/dovekies.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dovekies.ts)</sup>

### Dovekies

```ts
interface Dovekies {
  <R, S, T>(
    f: (r: R) => (s: S) => T,
  ): <X>(g: (x: X) => R) => (x: X) => <Y>(h: (y: Y) => S) => (y: Y) => T;
}
```

The Dovekies — `D2`.

```text
D2 f g x h y = f (g x) (h y)
```

Transform BOTH arguments of a binary function, each by its own transformer.
Compare the Psi bird, which applies the SAME transformer to both — the
Dovekies is Psi's asymmetric cousin, and `D2 f g g ≡ Ψ f g` when the two
transformers coincide. The law suite asserts that.

<sup>Source: [`src/birds/dovekies.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/dovekies.ts)</sup>

### duplicate

```ts
const duplicate: Warbler
```

Apply a curried binary function to the same argument twice. Identical to {@link W}.

<sup>Source: [`src/birds/warbler.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/warbler.ts)</sup>

### E

```ts
const E: Eagle
```

Apply a binary function whose second argument comes from another binary function.

<sup>Source: [`src/birds/eagle.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/eagle.ts)</sup>

### eagle

```ts
const eagle: Eagle
```

The Eagle, by name. Identical to {@link E}.

<sup>Source: [`src/birds/eagle.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/eagle.ts)</sup>

### Eagle

```ts
interface Eagle {
  <X, R, S>(
    f: (x: X) => (r: R) => S,
  ): (x: X) => <Y, Z>(g: (y: Y) => (z: Z) => R) => (y: Y) => (z: Z) => S;
}
```

The Eagle — `E`.

```text
E f x g y z = f x (g y z)
```

Apply a binary function whose second argument is itself produced by a binary
function. `E ≡ B (B B B)`, though as with the other higher compositions that
derivation is not typeable here.

<sup>Source: [`src/birds/eagle.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/eagle.ts)</sup>

### F

```ts
const F: Finch
```

Hold two values and apply a function to them reversed.

@example
```ts
import { F } from 'smullyan/birds'

const cat = (a: string) => (b: string): string => a + b
F('foo')('bar')(cat) // 'barfoo'
```

<sup>Source: [`src/birds/finch.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/finch.ts)</sup>

### finch

```ts
const finch: Finch
```

The Finch, by name. Identical to {@link F}.

<sup>Source: [`src/birds/finch.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/finch.ts)</sup>

### Finch

```ts
interface Finch {
  <A>(a: A): <B>(b: B) => <C>(f: (b: B) => (a: A) => C) => C;
}
```

The Finch — `F`.

```text
F x y f = f y x
```

Hold two values, then apply a function to them in reverse order. The Finch is
the Vireo's mirror — `F ≡ C V` — which the law suite asserts.

<sup>Source: [`src/birds/finch.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/finch.ts)</sup>

### fix

```ts
const fix: Sage
```

The fixed-point combinator. Identical to {@link Y}.

<sup>Source: [`src/birds/sage.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/sage.ts)</sup>

### flip

```ts
const flip: Cardinal
```

Flip a curried binary function's argument order. Identical to {@link C}.

<sup>Source: [`src/birds/cardinal.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/cardinal.ts)</sup>

### G

```ts
const G: Goldfinch
```

Combine an untouched argument with a transformed one, crosswise.

@example
```ts
import { G } from 'smullyan/birds'

const sub = (a: number) => (b: number): number => a - b
const len = (s: string): number => s.length

G(sub)(len)('abc')(10) // 10 - 3
```

<sup>Source: [`src/birds/goldfinch.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/goldfinch.ts)</sup>

### goldfinch

```ts
const goldfinch: Goldfinch
```

The Goldfinch, by name. Identical to {@link G}.

<sup>Source: [`src/birds/goldfinch.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/goldfinch.ts)</sup>

### Goldfinch

```ts
interface Goldfinch {
  <Y, R, S>(f: (y: Y) => (r: R) => S): <X>(g: (x: X) => R) => (x: X) => (y: Y) => S;
}
```

The Goldfinch — `G`.

```text
G f g x y = f y (g x)
```

Transform one argument, leave the other alone, and combine them crosswise.
The Goldfinch is `B B C` composed with itself in the sense that it both
flips and pre-processes — useful for comparators where only one side needs
projecting.

<sup>Source: [`src/birds/goldfinch.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/goldfinch.ts)</sup>

### H

```ts
const H: Hummingbird
```

Apply a ternary function with its first argument reused as the third.

@example
```ts
import { H } from 'smullyan/birds'

const between = (a: number) => (b: number) => (c: number): string =>
  `${a}-${b}-${c}`

H(between)(1)(2) // '1-2-1'
```

<sup>Source: [`src/birds/hummingbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/hummingbird.ts)</sup>

### hummingbird

```ts
const hummingbird: Hummingbird
```

The Hummingbird, by name. Identical to {@link H}.

<sup>Source: [`src/birds/hummingbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/hummingbird.ts)</sup>

### Hummingbird

```ts
interface Hummingbird {
  <A, B, C>(f: (a: A) => (b: B) => (a2: A) => C): (a: A) => (b: B) => C;
}
```

The Hummingbird — `H`.

```text
H f x y = f x y x
```

Supply the first argument twice, once at each end. The Hummingbird is the
Warbler's three-argument relative — where `W` duplicates into adjacent
positions, `H` duplicates across a gap.

<sup>Source: [`src/birds/hummingbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/hummingbird.ts)</sup>

### I

```ts
const I: Idiot
```

Return the argument unchanged.

@example
```ts
import { I } from 'smullyan/birds'

I(42)      // 42
I('same')  // 'same'
```

<sup>Source: [`src/birds/idiot.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot.ts)</sup>

### identity

```ts
const identity: Idiot
```

The identity function. Identical to {@link I}.

<sup>Source: [`src/birds/idiot.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot.ts)</sup>

### idiot

```ts
const idiot: Idiot
```

The Idiot, by name. Identical to {@link I}.

<sup>Source: [`src/birds/idiot.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot.ts)</sup>

### Idiot

```ts
interface Idiot {
  <A>(a: A): A;
}
```

The Idiot — `I`.

```text
I x = x
```

The identity function, and the simplest bird in the forest. Smullyan calls it
the Idiot because it merely echoes back whatever it is called with.

`I` is derivable rather than primitive: `S K K ≡ I` and `W K ≡ I`. Both are
asserted in the law suite, which is the cheapest possible check that the
Starling, Kestrel and Warbler all agree with each other.

<sup>Source: [`src/birds/idiot.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot.ts)</sup>

### idiotOnceRemoved

```ts
const idiotOnceRemoved: IdiotOnceRemoved
```

The Idiot once removed, by name. Identical to {@link IStar}.

<sup>Source: [`src/birds/idiot-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot-once-removed.ts)</sup>

### IdiotOnceRemoved

```ts
interface IdiotOnceRemoved {
  <A, B>(f: (a: A) => B): (a: A) => B;
}
```

The Idiot once removed — `I*`.

```text
I* f x = f x
```

Explicit function application. `I*` is the Identity bird lifted one level:
where `I` returns its argument, `I*` returns its argument APPLIED. It is
extensionally equal to `I` on functions — `I* f ≡ I f` — which the law suite
asserts, and it is what most languages call `apply`.

<sup>Source: [`src/birds/idiot-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot-once-removed.ts)</sup>

### IStar

```ts
const IStar: IdiotOnceRemoved
```

Apply a function to a value.

@example
```ts
import { IStar } from 'smullyan/birds'

const inc = (n: number): number => n + 1
IStar(inc)(41) // 42
```

<sup>Source: [`src/birds/idiot-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/idiot-once-removed.ts)</sup>

### J

```ts
const J: Jay
```

Apply a binary accumulating function twice, nested.

@example
```ts
import { J } from 'smullyan/birds'

const cat = (a: string) => (b: string): string => a + b
J(cat)('a')('b')('c') // 'a' + ('c' + 'b') = 'acb'
```

<sup>Source: [`src/birds/jay.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/jay.ts)</sup>

### jay

```ts
const jay: Jay
```

The Jay, by name. Identical to {@link J}.

<sup>Source: [`src/birds/jay.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/jay.ts)</sup>

### Jay

```ts
interface Jay {
  <A, B>(f: (a: A) => (b: B) => B): (x: A) => (y: B) => (z: A) => B;
}
```

The Jay — `J`.

```text
J f x y z = f x (f z y)
```

The Jay uses the same function twice, nesting one application inside the
other. Note the type constraint this forces: `f`'s result must be assignable
to `f`'s own second parameter, since `f z y` is fed back in as an argument.
That makes `f` an accumulating operation — exactly the shape of a fold step.

<sup>Source: [`src/birds/jay.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/jay.ts)</sup>

### K

```ts
const K: Kestrel
```

Produce a function that ignores its argument and always returns `a`.

@example
```ts
import { K } from 'smullyan/birds'

const always42 = K(42)
always42('ignored')  // 42
always42(null)       // 42
```

<sup>Source: [`src/birds/kestrel.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/kestrel.ts)</sup>

### kestrel

```ts
const kestrel: Kestrel
```

The Kestrel, by name. Identical to {@link K}.

<sup>Source: [`src/birds/kestrel.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/kestrel.ts)</sup>

### Kestrel

```ts
interface Kestrel {
  <A>(a: A): <B>(b: B) => A;
}
```

The Kestrel — `K`.

```text
K x y = x
```

The constant function. `K` takes a value and returns a function that ignores
its argument and yields that value. In Smullyan's forest the Kestrel is the
bird whose response to any call is always the same.

`K` is one half of the SKI basis, and `S K K ≡ I` — applying the Starling to
two Kestrels reconstructs the Identity bird. That derivation is asserted in
the law suite once the Starling lands.

`B` is inferred at the SECOND call, so it is scoped there: nothing about the
discarded argument is knowable from `a` alone.

<sup>Source: [`src/birds/kestrel.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/kestrel.ts)</sup>

### KI

```ts
const KI: Kite
```

Produce a function that ignores the first argument and returns the second.

@example
```ts
import { KI } from 'smullyan/birds'

KI('discarded')(42) // 42
```

<sup>Source: [`src/birds/kite.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/kite.ts)</sup>

### kite

```ts
const kite: Kite
```

The Kite, by name. Identical to {@link KI}.

<sup>Source: [`src/birds/kite.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/kite.ts)</sup>

### Kite

```ts
interface Kite {
  <A>(a: A): <B>(b: B) => B;
}
```

The Kite — `KI`.

```text
KI x y = y
```

The Kestrel's mirror: ignore the FIRST argument and return the second.

The name is literal — the Kite is `K I`, the Kestrel applied to the Identity
bird. It is also `C K`, the Cardinal applied to the Kestrel. Both derivations
are asserted in the law suite, since a bird that can be built two ways is a
bird whose implementation can be checked twice.

<sup>Source: [`src/birds/kite.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/kite.ts)</sup>

### L

```ts
const L: Lark
```

Self-apply the second argument, then pass the result to the first.

@example
```ts
import { L } from 'smullyan/birds'
import type { SelfApplicable } from 'smullyan/birds'

const five: SelfApplicable<number> = () => 5
const inc = (n: number): number => n + 1

L(inc)(five) // 6
```

<sup>Source: [`src/birds/lark.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/lark.ts)</sup>

### lark

```ts
const lark: Lark
```

The Lark, by name. Identical to {@link L}.

<sup>Source: [`src/birds/lark.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/lark.ts)</sup>

### Lark

```ts
interface Lark {
  <A, B>(f: (a: A) => B): (y: SelfApplicable<A>) => B;
}
```

The Lark — `L`.

```text
L x y = x (y y)
```

Apply `y` to itself, then hand the result to `x`. The Lark is the
Mockingbird composed with the Bluebird — `L ≡ B M` — and like the
Mockingbird it requires a self-referential type.

`L L L` is another non-terminating term. As with the Mockingbird, the Lark is
useful when the self-applied argument bounds its own recursion.

<sup>Source: [`src/birds/lark.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/lark.ts)</sup>

### M

```ts
const M: Mockingbird
```

Apply a function to itself.

@example
```ts
import { M } from 'smullyan/birds'
import type { SelfApplicable } from 'smullyan/birds'

// Safe: ignores its argument, so it terminates.
const answer: SelfApplicable<number> = () => 42
M(answer) // 42

// M(M) would type-check and loop forever — this is the term Ω.
```

<sup>Source: [`src/birds/mockingbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/mockingbird.ts)</sup>

### mockingbird

```ts
const mockingbird: Mockingbird
```

The Mockingbird, by name. Identical to {@link M}.

<sup>Source: [`src/birds/mockingbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/mockingbird.ts)</sup>

### Mockingbird

```ts
interface Mockingbird {
  <A>(x: SelfApplicable<A>): A;
}
```

The Mockingbird — `M`.

```text
M x = x x
```

Self-application, and the bird the book is named for. The Mockingbird
responds to every call by repeating it back to itself.

`M` is NOT typeable in a simply-typed lambda calculus. TypeScript expresses
it via {@link SelfApplicable}, a lazily-resolved self-referential interface —
see `self-application.ts` for why that works.

## Divergence

`M(M)` is the classic non-terminating term `Ω`. It type-checks and it hangs.
That is not a bug here: `Ω` has no normal form, so no implementation could do
better. Types rule out type errors, not infinite loops.

The Mockingbird is only useful when applied to something that IGNORES or
bounds its argument — which is exactly how the Sage bird uses it internally.

<sup>Source: [`src/birds/mockingbird.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/mockingbird.ts)</sup>

### O

```ts
const O: Owl
```

Apply `f` to `g`, then `g` to the result.

@example
```ts
import { O } from 'smullyan/birds'

const pick = (_g: (n: number) => string): number => 41
const show = (n: number): string => String(n)

O(pick)(show) // '41'
```

<sup>Source: [`src/birds/owl.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/owl.ts)</sup>

### on

```ts
const on: Psi
```

Combine two values on a shared projection. Identical to {@link psi}.

<sup>Source: [`src/birds/psi.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/psi.ts)</sup>

### owl

```ts
const owl: Owl
```

The Owl, by name. Identical to {@link O}.

<sup>Source: [`src/birds/owl.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/owl.ts)</sup>

### Owl

```ts
interface Owl {
  <A, B>(f: (g: (a: A) => B) => A): (g: (a: A) => B) => B;
}
```

The Owl — `O`.

```text
O f g = g (f g)
```

The Owl is grouped with the hard forest by tradition, but it is the odd one
out: **it is perfectly simply-typeable**. No self-application appears in its
definition — `f` is applied to `g`, and `g` to the result. The recursion
people associate with it comes from what you PASS it, not from the bird.

`O ≡ S I`, asserted in the law suite. Feeding the Owl a self-applicative
argument is what produces fixed-point behaviour, which is why it keeps
company with the Mockingbird and the Sage.

<sup>Source: [`src/birds/owl.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/owl.ts)</sup>

### P

```ts
const P: Psi
```

The Psi bird, by symbol. Identical to {@link psi}.

<sup>Source: [`src/birds/psi.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/psi.ts)</sup>

### pair

```ts
const pair: Vireo
```

Church-encoded pair. Identical to {@link V}.

<sup>Source: [`src/birds/vireo.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/vireo.ts)</sup>

### Phi

```ts
const Phi: Phoenix
```

The Phoenix, by symbol. Identical to {@link phoenix}.

<sup>Source: [`src/birds/phoenix.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/phoenix.ts)</sup>

### phoenix

```ts
const phoenix: Phoenix
```

Apply two functions to one value and combine the results.

@example
```ts
import { phoenix } from 'smullyan/birds'

const divide = (a: number) => (b: number): number => a / b
const sum = (ns: readonly number[]): number => ns.reduce((a, b) => a + b, 0)
const count = (ns: readonly number[]): number => ns.length

const average = phoenix(divide)(sum)(count)
average([1, 2, 3, 4]) // 2.5
```

<sup>Source: [`src/birds/phoenix.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/phoenix.ts)</sup>

### Phoenix

```ts
interface Phoenix {
  <B, C, D>(f: (b: B) => (c: C) => D): <A>(g: (a: A) => B) => (h: (a: A) => C) => (a: A) => D;
}
```

The Phoenix — `Φ`.

```text
Φ f g h x = f (g x) (h x)
```

Feed one value through two different transformations, then combine the
results. Known elsewhere as `converge`, and as `liftA2` for the Reader monad.

The classic use is a fold-free average: `Φ(divide)(sum)(length)`.

`A` is deferred to the third call because neither `f` nor `g`'s position in
the first signature constrains it — it is first pinned when `h` arrives, and
`g` must agree with it.

<sup>Source: [`src/birds/phoenix.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/phoenix.ts)</sup>

### pipe2

```ts
const pipe2: Queer
```

Left-to-right composition. Identical to {@link Q}.

<sup>Source: [`src/birds/queer.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/queer.ts)</sup>

### psi

```ts
const psi: Psi
```

Combine two values after mapping both through the same function.

@example
```ts
import { psi } from 'smullyan/birds'

const compare = (a: number) => (b: number): number => a - b
const len = (s: string): number => s.length

const byLength = psi(compare)(len)
byLength('aaa')('a') // 2
```

<sup>Source: [`src/birds/psi.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/psi.ts)</sup>

### Psi

```ts
interface Psi {
  <B, C>(f: (b1: B) => (b2: B) => C): <A>(g: (a: A) => B) => (a1: A) => (a2: A) => C;
}
```

The Psi bird — `Ψ`.

```text
Ψ f g x y = f (g x) (g y)
```

Apply the same transformation to two values, then combine them. This is
Haskell's `on` and Ramda's `useWith` with a single shared transformer, and it
is the bird behind almost every comparator you have ever written:
`sortBy(Ψ(subtract)(prop('age')))`.

<sup>Source: [`src/birds/psi.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/psi.ts)</sup>

### Q

```ts
const Q: Queer
```

Compose two functions left to right.

@example
```ts
import { Q } from 'smullyan/birds'

const inc = (n: number): number => n + 1
const show = (n: number): string => String(n)

Q(inc)(show)(41) // '42'
```

<sup>Source: [`src/birds/queer.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/queer.ts)</sup>

### Q1

```ts
const Q1: Quixotic
```

Apply `x` to `g`, then `f` to the result.

<sup>Source: [`src/birds/quixotic.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quixotic.ts)</sup>

### Q2

```ts
const Q2: Quizzical
```

Apply `x` to `f`, then `g` to the result.

<sup>Source: [`src/birds/quizzical.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quizzical.ts)</sup>

### Q3

```ts
const Q3: Quirky
```

Apply `f` to `g`, then `x` to the result.

<sup>Source: [`src/birds/quirky.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quirky.ts)</sup>

### Q4

```ts
const Q4: Quacky
```

Apply `g` to `f`, then `x` to the result.

<sup>Source: [`src/birds/quacky.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quacky.ts)</sup>

### quacky

```ts
const quacky: Quacky
```

The Quacky bird, by name. Identical to {@link Q4}.

<sup>Source: [`src/birds/quacky.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quacky.ts)</sup>

### Quacky

```ts
interface Quacky {
  <F>(f: F): <R>(g: (f: F) => R) => <S>(x: (r: R) => S) => S;
}
```

The Quacky bird — `Q4`.

```text
Q4 f g x = x (g f)
```

The Quirky bird with its first two arguments exchanged: `Q4 ≡ C Q3`,
asserted in the law suite. It is also the Thrush iterated twice — the value
arrives first and each subsequent argument consumes what came before.

<sup>Source: [`src/birds/quacky.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quacky.ts)</sup>

### queer

```ts
const queer: Queer
```

The Queer bird, by name. Identical to {@link Q}.

<sup>Source: [`src/birds/queer.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/queer.ts)</sup>

### Queer

```ts
interface Queer {
  <A, B>(f: (a: A) => B): <C>(g: (b: B) => C) => (a: A) => C;
}
```

The Queer bird — `Q`.

```text
Q f g x = g (f x)
```

Composition in READING order: `Q f g` runs `f` first, then `g`. The Bluebird
composes right-to-left; the Queer bird is its left-to-right twin, and
`Q ≡ C B` — which the law suite asserts.

This is the shape most people mean by "pipe two functions together".

<sup>Source: [`src/birds/queer.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/queer.ts)</sup>

### quirky

```ts
const quirky: Quirky
```

The Quirky bird, by name. Identical to {@link Q3}.

<sup>Source: [`src/birds/quirky.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quirky.ts)</sup>

### Quirky

```ts
interface Quirky {
  <G, R>(f: (g: G) => R): (g: G) => <S>(x: (r: R) => S) => S;
}
```

The Quirky bird — `Q3`.

```text
Q3 f g x = x (f g)
```

Apply the first argument to the second, then hand the result to the third.
The Quirky bird is the Queer bird with its arguments rotated.

<sup>Source: [`src/birds/quirky.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quirky.ts)</sup>

### quixotic

```ts
const quixotic: Quixotic
```

The Quixotic bird, by name. Identical to {@link Q1}.

<sup>Source: [`src/birds/quixotic.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quixotic.ts)</sup>

### Quixotic

```ts
interface Quixotic {
  <R, S>(f: (r: R) => S): <G>(g: G) => (x: (g: G) => R) => S;
}
```

The Quixotic bird — `Q1`.

```text
Q1 f g x = f (x g)
```

One of Smullyan's four Q-birds, which between them cover the permutations of
"apply one of three things to another and pass the result on". Here the THIRD
argument is the function and the second is its input.

<sup>Source: [`src/birds/quixotic.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quixotic.ts)</sup>

### quizzical

```ts
const quizzical: Quizzical
```

The Quizzical bird, by name. Identical to {@link Q2}.

<sup>Source: [`src/birds/quizzical.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quizzical.ts)</sup>

### Quizzical

```ts
interface Quizzical {
  <F>(f: F): <R, S>(g: (r: R) => S) => (x: (f: F) => R) => S;
}
```

The Quizzical bird — `Q2`.

```text
Q2 f g x = g (x f)
```

The Quixotic bird with the roles of the first two arguments exchanged:
`Q2 ≡ C Q1`, asserted in the law suite.

<sup>Source: [`src/birds/quizzical.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/quizzical.ts)</sup>

### R

```ts
const R: Robin
```

Apply a binary function to arguments supplied out of order.

@example
```ts
import { R } from 'smullyan/birds'

const cat = (a: string) => (b: string): string => a + b
R('foo')(cat)('bar') // 'barfoo'
```

<sup>Source: [`src/birds/robin.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/robin.ts)</sup>

### robin

```ts
const robin: Robin
```

The Robin, by name. Identical to {@link R}.

<sup>Source: [`src/birds/robin.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/robin.ts)</sup>

### Robin

```ts
interface Robin {
  <A>(a: A): <B, C>(f: (b: B) => (a: A) => C) => (b: B) => C;
}
```

The Robin — `R`.

```text
R x f y = f y x
```

Take a value, then a binary function, then a second value — and apply the
function with the arguments in the opposite order to the one they arrived in.

`R ≡ B B C`, and applying the Robin three times is the identity: `R (R (R f))
≡ f`, since the Robin generates a cyclic permutation of three arguments.

<sup>Source: [`src/birds/robin.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/robin.ts)</sup>

### S

```ts
const S: Starling
```

Apply `f` and `g` to the same argument, then apply the results.

@example
```ts
import { S } from 'smullyan/birds'

const add = (a: number) => (b: number): number => a + b
const inc = (n: number): number => n + 1

// n + (n + 1)
const addToSuccessor = S(add)(inc)
addToSuccessor(20) // 41
```

<sup>Source: [`src/birds/starling.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/starling.ts)</sup>

### sage

```ts
const sage: Sage
```

The Sage bird, by name. Identical to {@link Y}.

<sup>Source: [`src/birds/sage.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/sage.ts)</sup>

### Sage

```ts
interface Sage {
  <A, B>(f: (rec: (a: A) => B) => (a: A) => B): (a: A) => B;
}
```

The Sage bird — `Y`.

```text
Y f = f (Y f)
```

The fixed-point combinator, and the reason anonymous functions can recurse.
`Y` takes a function that expects "itself" as its first argument and returns
the recursive function, with no name ever bound.

## Why this is the Z combinator, not the Y combinator

The textbook `Y = λf.(λx.f (x x)) (λx.f (x x))` is correct under LAZY
evaluation and diverges under eager evaluation: computing `f (x x)` demands
`x x` before `f` can decide whether it needs it, and `x x` expands forever.
JavaScript is eager, so the textbook form stack-overflows immediately.

The fix is eta-expansion — wrapping the recursive call in a lambda so it is
only forced when an argument actually arrives:

```text
Z = λf. (λx. f (λv. x x v)) (λx. f (λv. x x v))
```

`Z` is extensionally equal to `Y` for functions of at least one argument,
which is every practical use. The implementation below is `Z`, written with
genuine self-application rather than a named self-reference.

## Why not just use a named function?

```ts
const fix = (f) => { const g = (a) => f(g)(a); return g }  // NOT this
```

That works, but it defeats the point: `g` refers to itself by NAME, so it is
ordinary recursion wearing a combinator's clothes. The Sage bird's whole
purpose is achieving recursion WITHOUT self-reference, using only
application. The implementation below does that — `rec(rec)` is the only
mechanism, and `rec` never mentions itself inside its own body.

<sup>Source: [`src/birds/sage.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/sage.ts)</sup>

### SageSelf

```ts
interface SageSelf<A, B> {
  (x: SageSelf<A, B>): (a: A) => B;
}
```

The self-applicable shape used by the Sage bird's fixed-point construction.
Applying it to itself produces the recursive function itself.

<sup>Source: [`src/birds/self-application.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/self-application.ts)</sup>

### SelfApplicable

```ts
interface SelfApplicable<A> {
  (x: SelfApplicable<A>): A;
}
```

Recursive types for the hard forest.

Five birds — the Mockingbird, Lark, Owl, Turing bird and Sage — involve
SELF-APPLICATION, applying a term to itself. None of them can be typed in a
simply-typed lambda calculus: that is a theorem about the calculus, not a
shortcoming of TypeScript. In System F you would need something like
`∀a. a → a` applied to itself, which is ill-founded.

TypeScript gets through because its `interface` declarations are resolved
LAZILY and may reference themselves. `SelfApplicable<A>` below is a function
type whose parameter is its own type — legal here, impossible in Hindley
Milner without an explicit iso-recursive wrapper (Haskell's `newtype Mu`).

This is one of the few places where TypeScript's structural, equirecursive
type system is genuinely MORE expressive than Haskell's, rather than less.

The cost is honest and worth stating: a `SelfApplicable<A>` says nothing
about termination. `M(M)` is well typed and loops forever. The type system
is protecting you from type errors, not from divergence — no type system in
a Turing-complete language can promise the latter.
/

/**
A function that can be applied to itself, yielding `A`.

The self-reference in the parameter position is what makes the Mockingbird
expressible.

<sup>Source: [`src/birds/self-application.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/self-application.ts)</sup>

### starling

```ts
const starling: Starling
```

The Starling, by name. Identical to {@link S}.

<sup>Source: [`src/birds/starling.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/starling.ts)</sup>

### Starling

```ts
interface Starling {
  <A, B, C>(f: (a: A) => (b: B) => C): (g: (a: A) => B) => (a: A) => C;
}
```

The Starling — `S`.

```text
S f g x = f x (g x)
```

The substitution combinator, and the workhorse of the SKI basis: together
with the Kestrel it can express every other bird in the forest. `S K K ≡ I`
is the classic derivation, asserted in the law suite.

In everyday terms this is `ap` for the Reader monad — both `f` and `g`
receive the same environment `x`, and `f`'s result is applied to `g`'s.

All three type parameters are recoverable from `f` and `g` together, but `A`
appears in both, so it must be fixed by the first call for `g` to check
against it. Hence all three sit on the first signature.

<sup>Source: [`src/birds/starling.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/starling.ts)</sup>

### T

```ts
const T: Thrush
```

Apply a function to a value, value first.

@example
```ts
import { T } from 'smullyan/birds'

T(41)((n: number) => n + 1) // 42
```

<sup>Source: [`src/birds/thrush.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/thrush.ts)</sup>

### thrush

```ts
const thrush: Thrush
```

The Thrush, by name. Identical to {@link T}.

<sup>Source: [`src/birds/thrush.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/thrush.ts)</sup>

### Thrush

```ts
interface Thrush {
  <A>(a: A): <B>(f: (a: A) => B) => B;
}
```

The Thrush — `T`.

```text
T x f = f x
```

Reversed application: take a value, then take a function, then apply it. The
Thrush is `C I` — the Cardinal applied to the Idiot — which the law suite
asserts.

This is the one-argument `pipe`, and the reason `smullyan/pipe` exists: a
variadic `pipe` is just the Thrush iterated.

<sup>Source: [`src/birds/thrush.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/thrush.ts)</sup>

### turing

```ts
const turing: Turing
```

The Turing bird, by name. Identical to {@link U}.

<sup>Source: [`src/birds/turing.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/turing.ts)</sup>

### Turing

```ts
interface Turing {
  <A>(x: TuringSelf<A>): (y: (a: A) => A) => A;
}
```

The Turing bird — `U`.

```text
U x y = y (x x y)
```

Named for Alan Turing, who discovered the fixed-point combinator
`Θ = U U`. Applying the Turing bird to itself yields a fixed-point operator:
`Θ f = f (Θ f)`.

The `x x` in the definition is self-application, so this needs the recursive
{@link TuringSelf} type.

## Why `U U` is not exported

`Θ = U U` is correct in a lazy language and DIVERGES in an eager one:
evaluating `f (Θ f)` requires evaluating `Θ f` first, which requires
evaluating `Θ f` again, forever. JavaScript is eager, so `U(U)` type-checks
and immediately overflows the stack.

The usable eager fixed point is the eta-expanded Z combinator — see the Sage
bird {@link Y}, which is what you actually want for recursion.

<sup>Source: [`src/birds/turing.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/turing.ts)</sup>

### TuringSelf

```ts
interface TuringSelf<A> {
  (x: TuringSelf<A>): (y: (a: A) => A) => A;
}
```

The self-applicable shape used by the Turing bird, whose self-application is
followed by a further argument.

<sup>Source: [`src/birds/self-application.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/self-application.ts)</sup>

### U

```ts
const U: Turing
```

The Turing bird. Applied to itself it yields a fixed-point operator — which
diverges under eager evaluation. Use {@link Y} instead for real recursion.

@example
```ts
import { U } from 'smullyan/birds'
import type { TuringSelf } from 'smullyan/birds'

// A self-applicable that bounds its own recursion.
const stop: TuringSelf<number> = () => () => 0
const inc = (n: number): number => n + 1

U(stop)(inc) // 1
```

<sup>Source: [`src/birds/turing.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/turing.ts)</sup>

### V

```ts
const V: Vireo
```

Build a pair as a function awaiting its consumer.

@example
```ts
import { V, K, KI } from 'smullyan/birds'

const pair = V(1)('two')
pair(K)  // 1
pair(KI) // 'two'
```

<sup>Source: [`src/birds/vireo.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/vireo.ts)</sup>

### vireo

```ts
const vireo: Vireo
```

The Vireo, by name. Identical to {@link V}.

<sup>Source: [`src/birds/vireo.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/vireo.ts)</sup>

### Vireo

```ts
interface Vireo {
  <A>(a: A): <B>(b: B) => <C>(f: (a: A) => (b: B) => C) => C;
}
```

The Vireo — `V`.

```text
V x y f = f x y
```

Hold two values, then hand them to a function. The Vireo is the classical
encoding of a PAIR in pure lambda calculus: `V a b` is the pair, and applying
it to `K` extracts the first element, to `KI` the second. Both extractions
are asserted in the law suite.

<sup>Source: [`src/birds/vireo.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/vireo.ts)</sup>

### W

```ts
const W: Warbler
```

Apply a curried binary function to the same argument twice.

@example
```ts
import { W } from 'smullyan/birds'

const add = (a: number) => (b: number): number => a + b
const double = W(add)
double(21) // 42
```

<sup>Source: [`src/birds/warbler.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/warbler.ts)</sup>

### warbler

```ts
const warbler: Warbler
```

The Warbler, by name. Identical to {@link W}.

<sup>Source: [`src/birds/warbler.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/warbler.ts)</sup>

### Warbler

```ts
interface Warbler {
  <A, B>(f: (a: A) => (a2: A) => B): (a: A) => B;
}
```

The Warbler — `W`.

```text
W f x = f x x
```

Argument duplication: hand the same value to a curried binary function twice.

`W K ≡ I` — the Warbler applied to the Kestrel reconstructs the Identity
bird, since `K x x` discards the second copy. Asserted in the law suite.

In monadic terms this is `join` for the Reader monad: a `Reader&lt;R, Reader&lt;R,
A>>` collapsed by supplying the same environment to both layers.

<sup>Source: [`src/birds/warbler.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/warbler.ts)</sup>

### warblerOnceRemoved

```ts
const warblerOnceRemoved: WarblerOnceRemoved
```

The Warbler once removed, by name. Identical to {@link WStar}.

<sup>Source: [`src/birds/warbler-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/warbler-once-removed.ts)</sup>

### WarblerOnceRemoved

```ts
interface WarblerOnceRemoved {
  <A, B, C>(f: (a: A) => (b: B) => (b2: B) => C): (a: A) => (b: B) => C;
}
```

The Warbler once removed — `W*`.

```text
W* f x y = f x y y
```

The Warbler shifted one argument deeper: the FIRST argument passes through
untouched and the second is duplicated. `W* ≡ B W`, asserted in the law suite.

<sup>Source: [`src/birds/warbler-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/warbler-once-removed.ts)</sup>

### WStar

```ts
const WStar: WarblerOnceRemoved
```

Apply a ternary function with its second argument duplicated into the third.

<sup>Source: [`src/birds/warbler-once-removed.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/warbler-once-removed.ts)</sup>

### Y

```ts
const Y: Sage
```

Compute the fixed point of `f`, giving a recursive function with no name.

@example
```ts
import { Y } from 'smullyan/birds'

const factorial = Y<number, number>(
  (rec) => (n) => (n <= 1 ? 1 : n * rec(n - 1)),
)

factorial(5) // 120
```

<sup>Source: [`src/birds/sage.ts`](https://github.com/phyter1/smullyan/blob/main/src/birds/sage.ts)</sup>

## `smullyan/agent`

| Export | Kind | Summary |
| --- | --- | --- |
| [`Attempts`](#attempts) | interface | How many times a call may run in total, including the first. |
| [`backingOff`](#backingoff) | const | Wait according to this schedule between attempts. |
| [`Backoff`](#backoff) | type | A backoff schedule, as data. |
| [`callingApi`](#callingapi) | const | Lift an async call into a tool, classifying whatever it throws. |
| [`cappedAt`](#cappedat) | const | Never wait longer than this, however the schedule grows. |
| [`ClockBound`](#clockbound) | interface | The phrases that need a delay capability. |
| [`delayFor`](#delayfor) | const | The delay before attempt `n`, zero-indexed — `delayFor(b, 0)` precedes the FIRST retry, not the first call. |
| [`denied`](#denied) | const | The caller lacks permission. |
| [`Denied`](#denied) | interface | The caller is not permitted to do this. |
| [`Duration`](#duration) | interface | The readable dialect. |
| [`everyTime`](#everytime) | const | Wait the same duration before each retry. |
| [`explain`](#explain) | const | A sentence written for a language model to read. |
| [`exponential`](#exponential) | const | Retry after a geometrically growing delay. |
| [`Exponential`](#exponential) | interface | Wait `baseMs * factor^n`, optionally capped. |
| [`exponentiallyFrom`](#exponentiallyfrom) | const | Wait a geometrically growing duration, doubling by default. |
| [`fail`](#fail) | const | A tool call that always fails with `e`. |
| [`fallingBackTo`](#fallingbackto) | const | On failure, run this instead. |
| [`fixed`](#fixed) | const | Retry after a constant delay. |
| [`Fixed`](#fixed) | interface | Wait the same amount before every retry. |
| [`flatMap`](#flatmap) | const | Chain another tool call onto a successful result. |
| [`fromPromise`](#frompromise) | const | Lift a promise-returning function, classifying anything it throws. |
| [`fromThrown`](#fromthrown) | const | Classify a thrown value. |
| [`ignoringServerAdvice`](#ignoringserveradvice) | const | Follow the local schedule even when the server sent a `Retry-After`. |
| [`immediate`](#immediate) | const | Retry with no delay. |
| [`Immediate`](#immediate) | interface | Retry immediately. |
| [`immediately`](#immediately) | const | Retry with no delay at all. |
| [`inMillis`](#inmillis) | const | The duration in milliseconds. |
| [`invalidArgs`](#invalidargs) | const | Arguments failed validation. |
| [`InvalidArgs`](#invalidargs) | interface | Arguments failed validation before the tool ran. |
| [`isRetryable`](#isretryable) | const | Which failures are worth repeating. |
| [`map`](#map) | const | Apply a function to a successful result. |
| [`millis`](#millis) | const | A duration in milliseconds. |
| [`minutes`](#minutes) | const | A duration in minutes. |
| [`notFound`](#notfound) | const | The thing asked for does not exist. |
| [`NotFound`](#notfound) | interface | Dotted path to the offending argument, e.g. |
| [`onceOnly`](#onceonly) | const | A budget of exactly one attempt — never retry. |
| [`orDefaultingTo`](#ordefaultingto) | const | On failure, succeed with this value instead. |
| [`orElse`](#orelse) | const | Fall back to another tool call on failure. |
| [`parse`](#parse) | const | Validate an unknown value — typically JSON that came back over a wire — as a {@link ToolError}. |
| [`rateLimited`](#ratelimited) | const | The tool was rate limited. |
| [`RateLimited`](#ratelimited) | interface | A closed, serializable vocabulary of tool failures. |
| [`retry`](#retry) | const | Total attempts, INCLUDING the first. |
| [`RetryClause`](#retryclause) | type | One clause of a retry policy. |
| [`RetryPolicy`](#retrypolicy) | interface | How to retry, as data. |
| [`seconds`](#seconds) | const | A duration in seconds. |
| [`Sleep`](#sleep) | type | A delay capability. |
| [`succeed`](#succeed) | const | A tool call that always succeeds with `a`. |
| [`suggestedDelayMs`](#suggesteddelayms) | const | How long the error itself says to wait, if it says anything. |
| [`theValue`](#thevalue) | const | A tool that always succeeds with this value. |
| [`timedOut`](#timedout) | const | The tool exceeded its time budget. |
| [`timeout`](#timeout) | const | Fail with {@link Timeout} if the call has not settled within `ms`. |
| [`Timeout`](#timeout) | interface | Near-misses worth trying instead, if the tool can suggest any. |
| [`Tool`](#tool) | type | A tool call: an asynchronous operation that has not started yet and reports failure in its type. |
| [`ToolError`](#toolerror) | type | Everything a tool call is allowed to fail with. |
| [`unavailable`](#unavailable) | const | The tool is temporarily unusable. |
| [`Unavailable`](#unavailable) | interface | The tool exists but is temporarily unusable — upstream 5xx, cold start, outage. |
| [`Unknown`](#unknown) | interface | The capability that was missing, when it can be named. |
| [`unknownError`](#unknownerror) | const | An unclassifiable failure. |
| [`upTo`](#upto) | const | An attempt budget, written as `upTo(4).attempts`. |
| [`whileFailing`](#whilefailing) | const | Retry only failures matching this predicate. |
| [`whileTransient`](#whiletransient) | const | Retry any failure the vocabulary considers transient. |
| [`withClock`](#withclock) | const | Retry according to the given clauses, in any order. |
| [`withDefault`](#withdefault) | const | Supply a value on failure, ending the failure channel. |
| [`within`](#within) | const | An attempt budget, as a clause. |

### Attempts

```ts
interface Attempts {
  readonly _tag: 'Attempts';
  readonly total: number;
}
```

How many times a call may run in total, including the first.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### backingOff

```ts
const backingOff: (backoff: Backoff) => RetryClause
```

Wait according to this schedule between attempts.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### Backoff

```ts
type Backoff = Fixed | Exponential | Immediate
```

A backoff schedule, as data.

Data rather than a closure so a policy can be logged, persisted alongside a
durable run, and shown to a model that is deciding whether to keep waiting.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### callingApi

```ts
const callingApi: <A>(
  invoke: () => Promise<A>,
  classify?: (e: unknown) => ToolError,
) => Tool<A>
```

Lift an async call into a tool, classifying whatever it throws.

```ts
callingApi(() => gh.issues.get(id), asGithubError)
```

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### cappedAt

```ts
const cappedAt: (d: Duration) => (b: Backoff) => Backoff
```

Never wait longer than this, however the schedule grows.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### ClockBound

```ts
interface ClockBound {
  /**
   * Retry according to the given clauses, in any order.
   *
   * Accepts `upTo(n).attempts` directly as well as `within(...)`.
   */
  readonly retrying: (
    ...clauses: ReadonlyArray<RetryClause | Attempts>
  ) => <A>(tool: Tool<A>) => Tool<A>;
  /** Fail with a `Timeout` if the call has not answered within this duration. */
  readonly givingUpAfter: (d: Duration) => <A>(tool: Tool<A>) => Tool<A>;
}
```

The phrases that need a delay capability.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### delayFor

```ts
const delayFor: (backoff: Backoff, attempt: number) => number
```

The delay before attempt `n`, zero-indexed — `delayFor(b, 0)` precedes the
FIRST retry, not the first call.

Pure, so a schedule can be asserted without running anything.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### denied

```ts
const denied: (reason: string, required?: string) => ToolError
```

The caller lacks permission.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### Denied

```ts
interface Denied {
  readonly _tag: 'Denied';
  readonly reason: string;
  /** The capability that was missing, when it can be named. */
  readonly required?: string;
}
```

The caller is not permitted to do this. Retrying will not help.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### Duration

```ts
interface Duration {
  readonly _tag: 'Duration';
  readonly ms: number;
}
```

The readable dialect.

Everything here is a renaming of {@link ./tool} — no new behaviour — chosen so
that a call site states its own meaning and a reader (human or model) does not
have to fetch a signature to understand it.

## The problem this solves

`timeout(30)` is ambiguous: milliseconds or seconds? `retry({ times: 4 })`
is ambiguous: is the first call one of the four? Those facts live in
documentation, so anyone writing code without that documentation loaded
guesses — plausibly, and often wrongly.

Wrapping the scalar removes the guess. `seconds(30)` cannot be misread.
`upTo(4).attempts` settles the off-by-one at the call site. `whileFailing
(isTransient)` says which failures repeat without anyone looking up a default.

## Why the clock is bound once

Both retrying and timing out need a delay capability, and threading a `sleep`
argument through every phrase would reintroduce exactly the noise this
dialect exists to remove. {@link withClock} binds it once at the edge and
returns the phrases that need it.

@example
```ts
const { retrying, givingUpAfter } = withClock(systemClock)

const fetchIssue = pipe(
  callingApi(() => gh.issues.get(id)),
  retrying(
    whileFailing(isTransient),
    upTo(4).attempts,
    backingOff(exponentiallyFrom(millis(100))),
  ),
  givingUpAfter(seconds(10)),
  fallingBackTo(theValue('degraded')),
)
```
/

// --- Durations -------------------------------------------------------------

/** A length of time. Constructed by unit, so a call site cannot be misread.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### everyTime

```ts
const everyTime: (d: Duration) => Backoff
```

Wait the same duration before each retry.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### explain

```ts
const explain: (e: ToolError) => string
```

A sentence written for a language model to read.

Not a log line. Each message states what failed AND what to do differently,
because the consumer is a model deciding its next action. `NotFound` offers
suggestions; `InvalidArgs` names the path and what was expected; `Denied`
says explicitly not to retry.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### exponential

```ts
const exponential: (baseMs: number, factor?: number, maxMs?: number) => Backoff
```

Retry after a geometrically growing delay.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### Exponential

```ts
interface Exponential {
  readonly _tag: 'Exponential';
  readonly baseMs: number;
  readonly factor: number;
  readonly maxMs?: number;
}
```

Wait `baseMs * factor^n`, optionally capped.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### exponentiallyFrom

```ts
const exponentiallyFrom: (d: Duration, doubling?: number) => Backoff
```

Wait a geometrically growing duration, doubling by default.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### fail

```ts
const fail: <A>(e: ToolError) => Tool<A>
```

A tool call that always fails with `e`.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### fallingBackTo

```ts
const fallingBackTo: <A>(alternative: () => Tool<A>) => (tool: Tool<A>) => Tool<A>
```

On failure, run this instead.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### fixed

```ts
const fixed: (ms: number) => Backoff
```

Retry after a constant delay.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### Fixed

```ts
interface Fixed {
  readonly _tag: 'Fixed';
  readonly ms: number;
}
```

Wait the same amount before every retry.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### flatMap

```ts
const flatMap: <A, B>(f: (a: A) => Tool<B>) => (tool: Tool<A>) => Tool<B>
```

Chain another tool call onto a successful result.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### fromPromise

```ts
const fromPromise: <A>(
  f: () => Promise<A>,
  classify?: (e: unknown) => ToolError,
) => Tool<A>
```

Lift a promise-returning function, classifying anything it throws.

The boundary where an ordinary async API becomes a `Tool`. Pass `classify` to
map your client's failures onto the vocabulary — an HTTP 429 to
`rateLimited`, a 404 to `notFound` — so the model receives something it can
act on rather than a stringified exception.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### fromThrown

```ts
const fromThrown: (e: unknown) => ToolError
```

Classify a thrown value.

The boundary between "something was thrown" and this vocabulary. Deliberately
conservative: anything it cannot confidently classify becomes {@link Unknown}
with the original value attached, rather than being guessed into a variant
that would change retry behaviour.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### ignoringServerAdvice

```ts
const ignoringServerAdvice: RetryClause
```

Follow the local schedule even when the server sent a `Retry-After`.

Rarely what you want — the server's advice is better information than a local
guess — which is why it must be asked for by name.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### immediate

```ts
const immediate: Backoff
```

Retry with no delay.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### Immediate

```ts
interface Immediate {
  readonly _tag: 'Immediate';
}
```

Retry immediately.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### immediately

```ts
const immediately: Backoff
```

Retry with no delay at all.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### inMillis

```ts
const inMillis: (d: Duration) => number
```

The duration in milliseconds.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### invalidArgs

```ts
const invalidArgs: (path: string, expected: string, got: unknown) => ToolError
```

Arguments failed validation.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### InvalidArgs

```ts
interface InvalidArgs {
  readonly _tag: 'InvalidArgs';
  /** Dotted path to the offending argument, e.g. `"filters.since"`. */
  readonly path: string;
  readonly expected: string;
  readonly got: unknown;
}
```

Arguments failed validation before the tool ran.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### isRetryable

```ts
const isRetryable: (e: ToolError) => boolean
```

Which failures are worth repeating.

A total `Record` rather than a switch, so adding a variant to {@link ToolError}
without deciding its retry behaviour is a COMPILE error — a missing key — not
a silent default.
/
const RETRYABLE: Record&lt;ToolError['_tag'], boolean> = {
  RateLimited: true,
  Timeout: true,
  Unavailable: true,
  // Unclassified: assume transient once, and let the retry budget bound it.
  Unknown: true,
  // Repeating these produces the identical failure and burns context.
  InvalidArgs: false,
  Denied: false,
  NotFound: false,
};

/**
Is retrying this failure meaningful?

`InvalidArgs` and `Denied` are excluded: the same call will fail identically,
so retrying burns budget and, in an agent loop, burns context. The model
should change the call instead — which is exactly what those variants carry
enough information to do.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### map

```ts
const map: <A, B>(f: (a: A) => B) => (tool: Tool<A>) => Tool<B>
```

Apply a function to a successful result.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### millis

```ts
const millis: (n: number) => Duration
```

A duration in milliseconds.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### minutes

```ts
const minutes: (n: number) => Duration
```

A duration in minutes.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### notFound

```ts
const notFound: (searched: string, suggestions?: ReadonlyArray<string>) => ToolError
```

The thing asked for does not exist.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### NotFound

```ts
interface NotFound {
  readonly _tag: 'NotFound';
  readonly searched: string;
  /** Near-misses worth trying instead, if the tool can suggest any. */
  readonly suggestions?: ReadonlyArray<string>;
}
```

Dotted path to the offending argument, e.g. `"filters.since"`. */
  readonly path: string;
  readonly expected: string;
  readonly got: unknown;
}

/** The tool ran and the thing asked for does not exist.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### onceOnly

```ts
const onceOnly: Attempts
```

A budget of exactly one attempt — never retry.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### orDefaultingTo

```ts
const orDefaultingTo: <A>(value: A) => (tool: Tool<A>) => Tool<A>
```

On failure, succeed with this value instead.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### orElse

```ts
const orElse: <A>(alternative: (e: ToolError) => Tool<A>) => (tool: Tool<A>) => Tool<A>
```

Fall back to another tool call on failure.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### parse

```ts
const parse: (u: unknown) => Option<ToolError>
```

Validate an unknown value — typically JSON that came back over a wire — as a
{@link ToolError}.

The whole point of this module is that errors cross boundaries, and anything
that crosses a boundary comes back as `unknown`. Returning `Option` rather
than casting keeps that honest: a malformed envelope is absence, not a
`ToolError`-shaped lie.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### rateLimited

```ts
const rateLimited: (retryAfterMs: number, limit?: string) => ToolError
```

The tool was rate limited.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### RateLimited

```ts
interface RateLimited {
  readonly _tag: 'RateLimited';
  readonly retryAfterMs: number;
  readonly limit?: string;
}
```

A closed, serializable vocabulary of tool failures.

## Why this exists

When a tool call fails inside an agent loop, the failure has to travel: back
through a tool-result envelope, into the model's context, often across a
process or network boundary, and frequently into durable state so a run can
be resumed. A thrown `Error` survives none of that — `JSON.stringify(new
Error('x'))` is `{}` — and a stringly-typed message gives the model nothing
to branch on.

Every variant here is a plain object with a `_tag` and fields chosen so that
BOTH a program and a language model can act on them. `RateLimited` carries
how long to wait. `InvalidArgs` carries which argument path was wrong and
what arrived. `NotFound` carries what was searched for, so the model can try
a different query rather than repeat the same one.

## Closed on purpose

The union is closed so `match` is exhaustive and adding a variant is a
compile error at every call site. {@link Unknown} is the escape hatch for
genuinely unclassifiable failures — it carries the original value as
`unknown` rather than pretending it was an `Error`.
/

/** The tool was rate limited. `retryAfterMs` is the server's advice, when given.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### retry

```ts
const retry: (policy: RetryPolicy) => <A>(tool: Tool<A>) => Tool<A>
```

Total attempts, INCLUDING the first. `times: 1` never retries. */
  readonly times: number;
  readonly backoff: Backoff;
  readonly sleep: Sleep;
  /**
Which failures are worth repeating. Required, not defaulted: retrying an
`InvalidArgs` is always wrong, and a silent default would hide that.
{@link isRetryable} is the sensible choice for {@link ToolError}.
/
  readonly retryOn: (e: ToolError) => boolean;
  /**
Prefer the delay the error itself advises over the backoff schedule.
Only `RateLimited` carries one. Defaults to true — a server's `Retry-After`
is better information than any local guess.
/
  readonly respectRetryAfter?: boolean;
}

/**
Retry a tool call according to a policy.

Stops at the first success, the first non-retryable failure, or when the
attempt budget is spent — whichever comes first. The failure returned is
always the LAST one seen, so the caller sees why it finally gave up rather
than why it first stumbled.

@example
```ts
const sleep: Sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const resilient = retry({
  times: 4,
  backoff: exponential(200, 2, 5_000),
  sleep,
  retryOn: isRetryable,
})(fetchIssue)
```

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### RetryClause

```ts
type RetryClause = WhileFailing | Budget | BackingOff | IgnoringServerAdvice
```

One clause of a retry policy.

Clauses are order-independent and each names its own role, so a policy reads
as a sentence and cannot be assembled by positional accident.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### RetryPolicy

```ts
interface RetryPolicy {
  /** Total attempts, INCLUDING the first. `times: 1` never retries. */
  readonly times: number;
  readonly backoff: Backoff;
  readonly sleep: Sleep;
  /**
   * Which failures are worth repeating. Required, not defaulted: retrying an
   * `InvalidArgs` is always wrong, and a silent default would hide that.
   * {@link isRetryable} is the sensible choice for {@link ToolError}.
   */
  readonly retryOn: (e: ToolError) => boolean;
  /**
   * Prefer the delay the error itself advises over the backoff schedule.
   * Only `RateLimited` carries one. Defaults to true — a server's `Retry-After`
   * is better information than any local guess.
   */
  readonly respectRetryAfter?: boolean;
}
```

How to retry, as data.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### seconds

```ts
const seconds: (n: number) => Duration
```

A duration in seconds.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### Sleep

```ts
type Sleep = (ms: number) => Promise<void>
```

A delay capability.

Supply your host's timer once, at the edge:

```ts
const sleep: Sleep = (ms) => new Promise((r) => setTimeout(r, ms))
```

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### succeed

```ts
const succeed: <A>(a: A) => Tool<A>
```

A tool call that always succeeds with `a`.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### suggestedDelayMs

```ts
const suggestedDelayMs: (e: ToolError) => Option<number>
```

How long the error itself says to wait, if it says anything.

Only `RateLimited` carries server advice. Everything else defers to the
caller's backoff policy.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### theValue

```ts
const theValue: <A>(a: A) => () => Tool<A>
```

A tool that always succeeds with this value. Reads well inside `fallingBackTo`.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### timedOut

```ts
const timedOut: (afterMs: number) => ToolError
```

The tool exceeded its time budget.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### timeout

```ts
const timeout: (ms: number, sleep: Sleep) => <A>(tool: Tool<A>) => Tool<A>
```

Fail with {@link Timeout} if the call has not settled within `ms`.

The underlying work is NOT cancelled — JavaScript has no general mechanism to
do so, and pretending otherwise would be a lie. It races the call against the
clock and reports which won. If cancellation matters, the tool itself must
accept an `AbortSignal`; this bounds how long you *wait*, not how long the
work *runs*.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### Timeout

```ts
interface Timeout {
  readonly _tag: 'Timeout';
  readonly afterMs: number;
}
```

Near-misses worth trying instead, if the tool can suggest any. */
  readonly suggestions?: ReadonlyArray&lt;string>;
}

/** The tool did not answer within its budget.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### Tool

```ts
type Tool<A> = TaskResult<ToolError, A>
```

A tool call: an asynchronous operation that has not started yet and reports
failure in its type.

```ts
type Tool<A> = () => Promise<Result<ToolError, A>>
```

The thunk is what makes retry and timeout possible at all. A `Promise` has
already started and has cached its outcome, so it cannot be re-run; a `Tool`
is a *description* of a call, and every combinator here is just a way of
describing a different call in terms of it.

## The clock is injected

`setTimeout` is a host API, not an ECMAScript one, and this library
guarantees its published declarations carry no ambient dependency. So
anything that waits takes a {@link Sleep} rather than reaching for a global.

That constraint turned out to be a feature. Backoff schedules are pure data
and a fake clock makes them testable exactly, with no wall-clock waiting:

```ts
const waits: number[] = []
const fake: Sleep = async (ms) => { waits.push(ms) }
await retry({ times: 3, backoff: exponential(100), sleep: fake, retryOn }) (t)()
// waits === [100, 200]  — asserted, not slept through
```

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### ToolError

```ts
type ToolError =
  | RateLimited
  | InvalidArgs
  | NotFound
  | Timeout
  | Unavailable
  | Denied
  | Unknown
```

Everything a tool call is allowed to fail with.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### unavailable

```ts
const unavailable: (reason: string, status?: number) => ToolError
```

The tool is temporarily unusable.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### Unavailable

```ts
interface Unavailable {
  readonly _tag: 'Unavailable';
  readonly reason: string;
  readonly status?: number;
}
```

The tool exists but is temporarily unusable — upstream 5xx, cold start, outage.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### Unknown

```ts
interface Unknown {
  readonly _tag: 'Unknown';
  readonly message: string;
  readonly cause?: unknown;
}
```

The capability that was missing, when it can be named. */
  readonly required?: string;
}

/** Unclassifiable failure. Carries the original value without lying about its type.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### unknownError

```ts
const unknownError: (message: string, cause?: unknown) => ToolError
```

An unclassifiable failure.

<sup>Source: [`src/agent/error.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/error.ts)</sup>

### upTo

```ts
const upTo: (n: number) => { readonly attempts: Attempts }
```

An attempt budget, written as `upTo(4).attempts`.

The trailing `.attempts` is the point: it makes the unit explicit and settles
the perennial off-by-one. Four attempts means one call and three retries.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### whileFailing

```ts
const whileFailing: (predicate: (e: ToolError) => boolean) => RetryClause
```

Retry only failures matching this predicate. Defaults to {@link isRetryable}.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### whileTransient

```ts
const whileTransient: RetryClause
```

Retry any failure the vocabulary considers transient.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### withClock

```ts
const withClock: (clock: Sleep) => ClockBound
```

Retry according to the given clauses, in any order.

Accepts `upTo(n).attempts` directly as well as `within(...)`.
/
  readonly retrying: (
    ...clauses: ReadonlyArray&lt;RetryClause | Attempts>
  ) => &lt;A>(tool: Tool&lt;A>) => Tool&lt;A>;
  /** Fail with a `Timeout` if the call has not answered within this duration. */
  readonly givingUpAfter: (d: Duration) => &lt;A>(tool: Tool&lt;A>) => Tool&lt;A>;
}

/**
Bind a clock once, at the edge, and get the phrases that need it.

```ts
const systemClock: Sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const { retrying, givingUpAfter } = withClock(systemClock)
```

In tests, pass a clock that records instead of waits — backoff schedules then
become assertions rather than delays.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

### withDefault

```ts
const withDefault: <A>(onError: (e: ToolError) => A) => (tool: Tool<A>) => Tool<A>
```

Supply a value on failure, ending the failure channel.

<sup>Source: [`src/agent/tool.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/tool.ts)</sup>

### within

```ts
const within: (a: Attempts) => RetryClause
```

An attempt budget, as a clause. `upTo(4).attempts` is accepted directly.

<sup>Source: [`src/agent/phrases.ts`](https://github.com/phyter1/smullyan/blob/main/src/agent/phrases.ts)</sup>

## `smullyan/pipe`

| Export | Kind | Summary |
| --- | --- | --- |
| [`flow`](#flow) | const | Compose a sequence of functions into one, left to right. |
| [`Flow`](#flow) | interface | Compose up to twenty functions into one, left to right. |
| [`pipe`](#pipe) | const | Thread a value through a sequence of functions, left to right. |
| [`Pipe`](#pipe) | interface | `pipe` and `flow` — left-to-right function application. |

### flow

```ts
const flow: Flow
```

Compose a sequence of functions into one, left to right.

Unlike {@link pipe}, `flow` takes no value — it returns a function, and the
FIRST function may take any number of arguments.

@example
```ts
import { flow } from 'smullyan/pipe'

const add = (a: number, b: number): number => a + b
const show = (n: number): string => String(n)

const addThenShow = flow(add, show)
addThenShow(40, 2) // '42'
```

<sup>Source: [`src/pipe/pipe.ts`](https://github.com/phyter1/smullyan/blob/main/src/pipe/pipe.ts)</sup>

### Flow

```ts
interface Flow {
  <A extends ReadonlyArray<unknown>, B>(ab: (...a: A) => B): (...a: A) => B;
  <A extends ReadonlyArray<unknown>, B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C;
  <A extends ReadonlyArray<unknown>, B, C, D>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
  ): (...a: A) => D;
  <A extends ReadonlyArray<unknown>, B, C, D, E>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
  ): (...a: A) => E;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
  ): (...a: A) => F;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
  ): (...a: A) => G;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
  ): (...a: A) => H;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
  ): (...a: A) => I;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
  ): (...a: A) => J;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
  ): (...a: A) => K;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
  ): (...a: A) => L;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
  ): (...a: A) => M;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
  ): (...a: A) => N;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
  ): (...a: A) => O;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
  ): (...a: A) => P;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
  ): (...a: A) => Q;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
  ): (...a: A) => R;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
    rs: (r: R) => S,
  ): (...a: A) => S;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
    rs: (r: R) => S,
    st: (s: S) => T,
  ): (...a: A) => T;
  <A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
    rs: (r: R) => S,
    st: (s: S) => T,
    tu: (t: T) => U,
  ): (...a: A) => U;
}
```

Compose up to twenty functions into one, left to right.

<sup>Source: [`src/pipe/pipe.ts`](https://github.com/phyter1/smullyan/blob/main/src/pipe/pipe.ts)</sup>

### pipe

```ts
const pipe: Pipe
```

Thread a value through a sequence of functions, left to right.

@example
```ts
import { pipe } from 'smullyan/pipe'

const inc = (n: number): number => n + 1
const show = (n: number): string => String(n)

pipe(41, inc, show) // '42'
```

<sup>Source: [`src/pipe/pipe.ts`](https://github.com/phyter1/smullyan/blob/main/src/pipe/pipe.ts)</sup>

### Pipe

```ts
interface Pipe {
  <A>(a: A): A;
  <A, B>(a: A, ab: (a: A) => B): B;
  <A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
  <A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
  <A, B, C, D, E>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E): E;
  <A, B, C, D, E, F>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
  ): F;
  <A, B, C, D, E, F, G>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
  ): G;
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
  ): H;
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
  ): I;
  <A, B, C, D, E, F, G, H, I, J>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
  ): J;
  <A, B, C, D, E, F, G, H, I, J, K>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
  ): K;
  <A, B, C, D, E, F, G, H, I, J, K, L>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
  ): L;
  <A, B, C, D, E, F, G, H, I, J, K, L, M>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
  ): M;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
  ): N;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
  ): O;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
  ): P;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
  ): Q;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
  ): R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
    rs: (r: R) => S,
  ): S;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
    rs: (r: R) => S,
    st: (s: S) => T,
  ): T;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q,
    qr: (q: Q) => R,
    rs: (r: R) => S,
    st: (s: S) => T,
    tu: (t: T) => U,
  ): U;
}
```

`pipe` and `flow` — left-to-right function application.

These are the Thrush ({@link T}) and the Queer bird ({@link Q}) iterated:
`pipe` threads a VALUE through a sequence of functions, `flow` composes the
functions into a new one without supplying a value yet.

```text
pipe(x, f, g, h)  ≡  h(g(f(x)))
flow(f, g, h)(x)  ≡  h(g(f(x)))
```

## Why these are overload chains rather than variadic generics

TypeScript's variadic tuple types can express "a chain of functions where
each output feeds the next", but inference through such a type degrades
badly: intermediate positions widen to `unknown` and the error messages
become unreadable. A hand-written overload chain gives exact inference at
every arity, at the cost of a large but entirely mechanical file.

This is the ONE place in smullyan where overloads are correct. Combinators
are curried and single-signature precisely to avoid overload resolution;
`pipe` and `flow` are variadic by nature, so there is no single signature to
write. See `bluebird.ts` for the reasoning that applies everywhere else.

Both support up to twenty functions. Beyond that, nest a second `pipe`.
/

/** Thread a value through up to twenty functions, left to right.

<sup>Source: [`src/pipe/pipe.ts`](https://github.com/phyter1/smullyan/blob/main/src/pipe/pipe.ts)</sup>

## `smullyan/option`

| Export | Kind | Summary |
| --- | --- | --- |
| [`ap`](#ap) | const | Apply a wrapped function to a wrapped value. |
| [`filter`](#filter) | const | Discard the value unless it satisfies a predicate. |
| [`flatMap`](#flatmap) | const | Chain a computation that itself may be absent. |
| [`flatten`](#flatten) | const | Remove one level of nesting. |
| [`fromNullable`](#fromnullable) | const | Convert a nullable value. |
| [`fromPredicate`](#frompredicate) | const | Keep a value only if it satisfies a predicate. |
| [`fromThrowable`](#fromthrowable) | const | Run a function that may throw, capturing failure as {@link none}. |
| [`getOrElse`](#getorelse) | const | Extract the value, computing a fallback if absent. |
| [`isNone`](#isnone) | const | Type guard narrowing to {@link None}. |
| [`isSome`](#issome) | const | Type guard narrowing to {@link Some}. |
| [`map`](#map) | const | Apply a function to the value if present. |
| [`match`](#match) | const | Exhaustively handle both cases. |
| [`none`](#none) | const | The absent value. |
| [`None`](#none) | interface | The absent case. |
| [`Option`](#option) | type | A value that may be absent. |
| [`orElse`](#orelse) | const | Fall back to another `Option` if absent. |
| [`sequence`](#sequence) | const | Turn a list of `Option`s into an `Option` of a list. |
| [`some`](#some) | const | Wrap a present value. |
| [`Some`](#some) | interface | `Option<A>` — a value that may be absent. |
| [`toNullable`](#tonullable) | const | Collapse to `null` when absent. |
| [`toUndefined`](#toundefined) | const | Collapse to `undefined` when absent. |
| [`traverse`](#traverse) | const | Map each element to an `Option`, then {@link sequence}. |

### ap

```ts
const ap: <A, B>(ff: Option<(a: A) => B>) => (fa: Option<A>) => Option<B>
```

Apply a wrapped function to a wrapped value. Applicative `ap`.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### filter

```ts
const filter: <A>(predicate: (a: A) => boolean) => (fa: Option<A>) => Option<A>
```

Discard the value unless it satisfies a predicate.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### flatMap

```ts
const flatMap: <A, B>(f: (a: A) => Option<B>) => (fa: Option<A>) => Option<B>
```

Chain a computation that itself may be absent. Monadic `bind`.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### flatten

```ts
const flatten: <A>(fa: Option<Option<A>>) => Option<A>
```

Remove one level of nesting.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### fromNullable

```ts
const fromNullable: <A>(a: A | null | undefined) => Option<NonNullable<A>>
```

Convert a nullable value. Both `null` and `undefined` become {@link none}.

@example
```ts
fromNullable(document.getElementById('x')) // Option<HTMLElement>
```

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### fromPredicate

```ts
const fromPredicate: <A>(predicate: (a: A) => boolean) => (a: A) => Option<A>
```

Keep a value only if it satisfies a predicate.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### fromThrowable

```ts
const fromThrowable: <A>(f: () => A) => Option<A>
```

Run a function that may throw, capturing failure as {@link none}.

The error itself is discarded — use `Result.fromThrowable` when you need it.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### getOrElse

```ts
const getOrElse: <A>(onNone: () => A) => (fa: Option<A>) => A
```

Extract the value, computing a fallback if absent.

The fallback is a THUNK so it is not evaluated when the value is present —
which matters when producing it is expensive or throws.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### isNone

```ts
const isNone: <A>(fa: Option<A>) => fa is None
```

Type guard narrowing to {@link None}.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### isSome

```ts
const isSome: <A>(fa: Option<A>) => fa is Some<A>
```

Type guard narrowing to {@link Some}.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### map

```ts
const map: <A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B>
```

Apply a function to the value if present. Functor `map`.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### match

```ts
const match: <A, B>(onNone: () => B, onSome: (a: A) => B) => (fa: Option<A>) => B
```

Exhaustively handle both cases.

Takes the absent branch first, matching the declaration order of
`Option<A> = Some<A> | None` read as "failure then success" — the same order
`Result.match` uses, so the two are visually consistent.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### none

```ts
const none: Option<never>
```

The absent value.

A single frozen constant rather than a function: `None` carries no payload,
so there is nothing to allocate per use.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### None

```ts
interface None {
  readonly _tag: 'None';
}
```

The absent case. Carries no payload.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### Option

```ts
type Option<A> = Some<A> | None
```

A value that may be absent.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### orElse

```ts
const orElse: <A>(onNone: () => Option<A>) => (fa: Option<A>) => Option<A>
```

Fall back to another `Option` if absent.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### sequence

```ts
const sequence: <A>(fas: ReadonlyArray<Option<A>>) => Option<ReadonlyArray<A>>
```

Turn a list of `Option`s into an `Option` of a list.

Absent if ANY element is absent — the standard applicative sequence, and it
short-circuits on the first `None`.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### some

```ts
const some: <A>(value: A) => Option<A>
```

Wrap a present value.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### Some

```ts
interface Some<A> {
  readonly _tag: 'Some';
  readonly value: A;
}
```

`Option<A>` — a value that may be absent.

A discriminated union, not a class. That means it is structurally typed,
serialises to plain JSON, and narrows correctly with a bare `switch` on
`_tag` even if you never touch a helper in this module.

```ts
const o: Option<number> = some(42)
if (o._tag === 'Some') o.value // narrowed to number
```

## Why `readonly` and why a `_tag`

The tag is a string literal rather than a symbol or a class so the value
survives `JSON.stringify` and a structured clone. Everything is `readonly`
because these are values, not containers to mutate.

## Data-last, curried

Every combinator takes its function first and the `Option` last, so it drops
straight into `pipe`:

```ts
pipe(some(20), map(inc), filter(isEven), getOrElse(() => 0))
```

Note the annotation style: these are `const`s with explicit function-type
annotations rather than the named-interface pattern the birds use.
`isolatedDeclarations` is satisfied either way; the birds carry named
interfaces because those types are part of their documented identity
(`Bluebird`, `Cardinal`), whereas these are ordinary functions.
/

/** The present case.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### toNullable

```ts
const toNullable: <A>(fa: Option<A>) => A | null
```

Collapse to `null` when absent.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### toUndefined

```ts
const toUndefined: <A>(fa: Option<A>) => A | undefined
```

Collapse to `undefined` when absent.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

### traverse

```ts
const traverse: <A, B>(
  f: (a: A) => Option<B>,
) => (as: ReadonlyArray<A>) => Option<ReadonlyArray<B>>
```

Map each element to an `Option`, then {@link sequence}.

<sup>Source: [`src/option/option.ts`](https://github.com/phyter1/smullyan/blob/main/src/option/option.ts)</sup>

## `smullyan/result`

| Export | Kind | Summary |
| --- | --- | --- |
| [`ap`](#ap) | const | Apply a wrapped function to a wrapped value. |
| [`err`](#err) | const | Wrap a failure. |
| [`Err`](#err) | interface | The failure case. |
| [`flatMap`](#flatmap) | const | Chain a computation that may itself fail. |
| [`flatten`](#flatten) | const | Remove one level of nesting. |
| [`fromNullable`](#fromnullable) | const | Convert a nullable value, using `onNullish` for the failure case. |
| [`fromThrowable`](#fromthrowable) | const | Run a function that may throw, capturing the thrown value. |
| [`getOrElse`](#getorelse) | const | Extract the success value, computing a fallback from the error. |
| [`isErr`](#iserr) | const | Type guard narrowing to {@link Err}. |
| [`isOk`](#isok) | const | Type guard narrowing to {@link Ok}. |
| [`map`](#map) | const | Apply a function to the success value. |
| [`mapErr`](#maperr) | const | Apply a function to the failure value. |
| [`match`](#match) | const | Exhaustively handle both cases. |
| [`ok`](#ok) | const | Wrap a success. |
| [`Ok`](#ok) | interface | `Result<E, A>` — a computation that either succeeded with `A` or failed with `E`. |
| [`orElse`](#orelse) | const | Fall back to another `Result` on failure. |
| [`Result`](#result) | type | A computation that either succeeded with `A` or failed with `E`. |
| [`sequence`](#sequence) | const | Turn a list of `Result`s into a `Result` of a list. |
| [`traverse`](#traverse) | const | Map each element to a `Result`, then {@link sequence}. |

### ap

```ts
const ap: <F, A, B>(
  ff: Result<F, (a: A) => B>,
) => <E>(fa: Result<E, A>) => Result<E | F, B>
```

Apply a wrapped function to a wrapped value. Fails on the FIRST error.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### err

```ts
const err: <E>(error: E) => Result<E, never>
```

Wrap a failure.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### Err

```ts
interface Err<E> {
  readonly _tag: 'Err';
  readonly error: E;
}
```

The failure case.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### flatMap

```ts
const flatMap: <A, F, B>(
  f: (a: A) => Result<F, B>,
) => <E>(fa: Result<E, A>) => Result<E | F, B>
```

Chain a computation that may itself fail.

The error types union rather than being forced to match, so a pipeline can
accumulate distinct failure modes without a common base type.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### flatten

```ts
const flatten: <E, F, A>(fa: Result<E, Result<F, A>>) => Result<E | F, A>
```

Remove one level of nesting.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### fromNullable

```ts
const fromNullable: <E, A>(
  onNullish: () => E,
) => (a: A | null | undefined) => Result<E, NonNullable<A>>
```

Convert a nullable value, using `onNullish` for the failure case.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### fromThrowable

```ts
const fromThrowable: <E, A>(f: () => A, onThrow: (e: unknown) => E) => Result<E, A>
```

Run a function that may throw, capturing the thrown value.

JavaScript lets you `throw` anything, so what arrives in a `catch` is
genuinely `unknown` — not `Error`. Rather than lie about that with a cast,
this takes an `onThrow` mapper and makes you decide. That is the honest
signature, and it is why there is no zero-argument overload.

@example
```ts
const parsed = fromThrowable(
  () => JSON.parse(input) as unknown,
  (e) => (e instanceof Error ? e.message : 'unknown parse failure'),
)
```

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### getOrElse

```ts
const getOrElse: <E, A>(onErr: (e: E) => A) => (fa: Result<E, A>) => A
```

Extract the success value, computing a fallback from the error.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### isErr

```ts
const isErr: <E, A>(fa: Result<E, A>) => fa is Err<E>
```

Type guard narrowing to {@link Err}.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### isOk

```ts
const isOk: <E, A>(fa: Result<E, A>) => fa is Ok<A>
```

Type guard narrowing to {@link Ok}.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### map

```ts
const map: <A, B>(f: (a: A) => B) => <E>(fa: Result<E, A>) => Result<E, B>
```

Apply a function to the success value. Failures pass through untouched.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### mapErr

```ts
const mapErr: <E, F>(f: (e: E) => F) => <A>(fa: Result<E, A>) => Result<F, A>
```

Apply a function to the failure value. Successes pass through untouched.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### match

```ts
const match: <E, A, B>(onErr: (e: E) => B, onOk: (a: A) => B) => (fa: Result<E, A>) => B
```

Exhaustively handle both cases. Failure branch first, as in `Option.match`.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### ok

```ts
const ok: <A>(value: A) => Result<never, A>
```

Wrap a success.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### Ok

```ts
interface Ok<A> {
  readonly _tag: 'Ok';
  readonly value: A;
}
```

`Result<E, A>` — a computation that either succeeded with `A` or failed
with `E`.

## Why the error type comes first

`Result<E, A>`, not `Result<A, E>`. Type parameters in TypeScript are applied
left to right, so putting `E` first is what makes `Result<ParseError, _>`
usable as a partially-applied type in an alias:

```ts
type Parsed<A> = Result<ParseError, A>
```

The cost is that the common case reads "backwards" relative to `Promise<A>`.
That is the standard trade in fp-ts's `Either<E, A>` and Rust's
`Result<T, E>` chose the opposite; this library follows the former because
partial application is the more useful property in a type system without
higher-kinded types.

## Why `Err` carries a bare `E`

`Err<E>` holds whatever you put in it — a string, an enum, an `Error`, a
tagged union of your own. It does NOT impose an error base class or a
`cause` chain.

The reasoning: the moment this module defines an error class, every consumer
inherits its opinion about error identity, serialisation and stack capture.
Domain errors are usually best modelled as plain discriminated unions, which
a bare `E` supports directly. If you want `Error` semantics, use
`Result<Error, A>` and nothing is lost.

The one place this shows is {@link fromThrowable}, where JavaScript hands us
an `unknown` — see the note there.

## Generic scoping

Every combinator here scopes `E` to the call that SUPPLIES it, exactly as the
birds do (see `birds/bluebird.ts`). Writing `map` as
`<E, A, B>(f: (a: A) => B) => (fa: Result<E, A>) => Result<E, B>` compiles
and is WRONG: `E` appears nowhere in `f`, so it defaults to `unknown` and the
error type is silently discarded.

That failure is invisible without a type test, because `Result<E, A>` is
COVARIANT in `E` — `Result<MyError, A>` is assignable to
`Result<unknown, A>`, so every call still compiles and every runtime test
still passes. `Reader<R, A>` is contravariant in `R` and therefore fails
loudly under the same mistake. Same bug, opposite volume.
/

/** The success case.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### orElse

```ts
const orElse: <E, F, A>(
  onErr: (e: E) => Result<F, A>,
) => (fa: Result<E, A>) => Result<F, A>
```

Fall back to another `Result` on failure.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### Result

```ts
type Result<E, A> = Ok<A> | Err<E>
```

A computation that either succeeded with `A` or failed with `E`.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### sequence

```ts
const sequence: <E, A>(fas: ReadonlyArray<Result<E, A>>) => Result<E, ReadonlyArray<A>>
```

Turn a list of `Result`s into a `Result` of a list.

Fails with the FIRST error and short-circuits. If you need every error, map
to a validation type that accumulates — this is the monadic sequence, and
short-circuiting is what makes it monadic.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

### traverse

```ts
const traverse: <E, A, B>(
  f: (a: A) => Result<E, B>,
) => (as: ReadonlyArray<A>) => Result<E, ReadonlyArray<B>>
```

Map each element to a `Result`, then {@link sequence}.

<sup>Source: [`src/result/result.ts`](https://github.com/phyter1/smullyan/blob/main/src/result/result.ts)</sup>

## `smullyan/task`

| Export | Kind | Summary |
| --- | --- | --- |
| [`all`](#all) | const | Run tasks CONCURRENTLY, collecting every result. |
| [`ap`](#ap) | const | Run two tasks CONCURRENTLY and apply the first's function to the second's value. |
| [`flatMap`](#flatmap) | const | Chain an asynchronous computation. |
| [`fromPromise`](#frompromise) | const | Wrap an existing promise. |
| [`fromSync`](#fromsync) | const | Lift a synchronous function into a `Task`. |
| [`map`](#map) | const | Apply a function to the eventual value. |
| [`of`](#of) | const | Lift a plain value into a `Task`. |
| [`sequential`](#sequential) | const | Run tasks in SEQUENCE, each starting only after the previous settles. |
| [`Task`](#task) | type | `Task<A>` — an asynchronous computation that has not started yet. |
| [`TaskResult`](#taskresult) | type | An asynchronous computation that may fail with `E`. |
| [`tryCatch`](#trycatch) | const | Run a task, capturing rejection as {@link Err}. |

### all

```ts
const all: <A>(tasks: ReadonlyArray<Task<A>>) => Task<ReadonlyArray<A>>
```

Run tasks CONCURRENTLY, collecting every result.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### ap

```ts
const ap: <A, B>(ff: Task<(a: A) => B>) => (fa: Task<A>) => Task<B>
```

Run two tasks CONCURRENTLY and apply the first's function to the second's
value.

Contrast {@link flatMap}, which is necessarily sequential because the second
task depends on the first's result. `ap` has no such dependency, so running
in sequence would waste the parallelism for nothing.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### flatMap

```ts
const flatMap: <A, B>(f: (a: A) => Task<B>) => (fa: Task<A>) => Task<B>
```

Chain an asynchronous computation.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### fromPromise

```ts
const fromPromise: <A>(f: () => Promise<A>) => Task<A>
```

Wrap an existing promise.

Note the argument is a THUNK, not a promise. Taking a promise directly would
defeat the purpose: it would already be running.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### fromSync

```ts
const fromSync: <A>(f: () => A) => Task<A>
```

Lift a synchronous function into a `Task`.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### map

```ts
const map: <A, B>(f: (a: A) => B) => (fa: Task<A>) => Task<B>
```

Apply a function to the eventual value.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### of

```ts
const of: <A>(a: A) => Task<A>
```

Lift a plain value into a `Task`.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### sequential

```ts
const sequential: <A>(tasks: ReadonlyArray<Task<A>>) => Task<ReadonlyArray<A>>
```

Run tasks in SEQUENCE, each starting only after the previous settles.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### Task

```ts
type Task<A> = () => Promise<A>
```

`Task<A>` — an asynchronous computation that has not started yet.

```ts
type Task<A> = () => Promise<A>
```

## Why a thunk, and not just a Promise

A `Promise` is EAGER: it begins executing the moment it is constructed, and
it caches its result. That makes promises values-in-flight rather than
descriptions of work, with three consequences a `Task` avoids:

- **You cannot retry a Promise.** It has already run; awaiting again returns
  the same settled value. A `Task` can be invoked as many times as you like.
- **You cannot delay a Promise.** Constructing it starts it. Building a
  pipeline out of promises therefore starts every step immediately.
- **Composition is not referentially transparent.** Substituting a promise
  for the expression that produced it changes when the work happens.

Wrapping in a thunk restores all three. `Task<A>` is a *description* of
asynchronous work; nothing happens until you call it.

## `Task` never fails

A `Task<A>` models an async computation that SUCCEEDS with `A`. If it can
fail, say so in the type: use {@link TaskResult}, which is
`Task<Result<E, A>>`. That keeps the failure channel explicit and typed
rather than hidden in a rejected promise that no signature mentions.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### TaskResult

```ts
type TaskResult<E, A> = Task<Result<E, A>>
```

An asynchronous computation that may fail with `E`.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

### tryCatch

```ts
const tryCatch: <E, A>(fa: Task<A>, onReject: (e: unknown) => E) => TaskResult<E, A>
```

Run a task, capturing rejection as {@link Err}.

This is the boundary between the promise world, where failure is untyped and
implicit, and the `Result` world, where it is neither. As with
`Result.fromThrowable`, you supply the mapper because a rejection value is
genuinely `unknown`.

<sup>Source: [`src/task/task.ts`](https://github.com/phyter1/smullyan/blob/main/src/task/task.ts)</sup>

## `smullyan/reader`

| Export | Kind | Summary |
| --- | --- | --- |
| [`ap`](#ap) | const | Apply a wrapped function to a wrapped value. |
| [`ask`](#ask) | const | Retrieve the environment itself. |
| [`asks`](#asks) | const | Retrieve a projection of the environment. |
| [`flatMap`](#flatmap) | const | Chain a computation that also needs the environment. |
| [`flatten`](#flatten) | const | Remove one level of nesting. |
| [`local`](#local) | const | Run a reader in a DERIVED environment. |
| [`map`](#map) | const | Apply a function to the result. |
| [`of`](#of) | const | A reader that ignores the environment and returns a constant. |
| [`Reader`](#reader) | type | `Reader<R, A>` — a computation awaiting an environment `R`. |
| [`run`](#run) | const | Supply the environment and get the result. |

### ap

```ts
const ap: <R, A, B>(ff: Reader<R, (a: A) => B>) => (fa: Reader<R, A>) => Reader<R, B>
```

Apply a wrapped function to a wrapped value.

This is the Starling: `ap ≡ S`.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### ask

```ts
const ask: <R>() => Reader<R, R>
```

Retrieve the environment itself.

Extensionally the identity function; named for intent.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### asks

```ts
const asks: <R, A>(f: (r: R) => A) => Reader<R, A>
```

Retrieve a projection of the environment.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### flatMap

```ts
const flatMap: <R, A, B>(f: (a: A) => Reader<R, B>) => (fa: Reader<R, A>) => Reader<R, B>
```

Chain a computation that also needs the environment.

Both the outer and inner reader receive the SAME `r` — which is exactly what
makes this dependency injection rather than mere composition.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### flatten

```ts
const flatten: <R, A>(ffa: Reader<R, Reader<R, A>>) => Reader<R, A>
```

Remove one level of nesting.

This is the Warbler: `flatten ≡ W`.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### local

```ts
const local: <R, S>(f: (s: S) => R) => <A>(fa: Reader<R, A>) => Reader<S, A>
```

Run a reader in a DERIVED environment.

The contravariant direction: `local` maps the environment BACKWARDS, letting
a component that needs a small environment run inside a larger one.

@example
```ts
type App = { readonly db: Db; readonly log: Logger }
const withDb: Reader<Db, string> = (db) => db.name

const inApp: Reader<App, string> = local((app: App) => app.db)(withDb)
```

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### map

```ts
const map: <A, B>(f: (a: A) => B) => <R>(fa: Reader<R, A>) => Reader<R, B>
```

Apply a function to the result.

This is the Bluebird: `map ≡ B`.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### of

```ts
const of: <R, A>(a: A) => Reader<R, A>
```

A reader that ignores the environment and returns a constant.

This is the Kestrel: `of ≡ K`.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### Reader

```ts
type Reader<R, A> = (r: R) => A
```

`Reader<R, A>` — a computation awaiting an environment `R`.

```ts
type Reader<R, A> = (r: R) => A
```

That is all it is: a function. The value of naming it is that a plain
function type has a `map`, a `flatMap` and an `ap`, and once you can see
that, dependency injection stops needing a framework.

## The birds were secretly about this all along

The Reader monad's operations ARE combinators from the aviary, applied to
functions rather than to values:

| Reader | Bird | Definition |
| --- | --- | --- |
| `map` | Bluebird `B` | `B f g x = f (g x)` |
| `ap` | Starling `S` | `S f g x = f x (g x)` |
| `flatMap` | Starling flipped | — |
| `join` | Warbler `W` | `W f x = f x x` |
| `of` | Kestrel `K` | `K x y = x` |

The law suite asserts each of these equivalences directly, which is a
pleasingly strong check: the ADT and the combinators have to agree, and they
were written independently.

## Why `ask` and not just the identity function

`ask` IS the identity function. Naming it documents intent at the call site —
"retrieve the environment" — rather than leaving a bare `id` for a reader to
decode.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

### run

```ts
const run: <R>(r: R) => <A>(fa: Reader<R, A>) => A
```

Supply the environment and get the result.

<sup>Source: [`src/reader/reader.ts`](https://github.com/phyter1/smullyan/blob/main/src/reader/reader.ts)</sup>

