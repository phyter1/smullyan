# smullyan

A fully typesafe functional programming library for TypeScript: the
combinatory-logic **bird combinators** of Raymond Smullyan's _To Mock a
Mockingbird_, plus a small core of algebraic data types.

> **Status: pre-release.** All thirty-five combinators are implemented,
> including the hard forest, with the full build, test and verification
> pipeline in place. The `option` / `result` / `task` / `reader` / `pipe` entry
> points are still to come. The API of what exists is unlikely to change, but
> treat it as unstable until `1.0.0`.

## Why birds

In _To Mock a Mockingbird_, Smullyan dresses combinatory logic up as a forest
of birds that respond to one another's calls. The joke conceals a complete
computational basis — and the birds turn out to be the functions working
programmers already reach for:

| Bird     | Combinator              | You know it as |
| -------- | ----------------------- | -------------- |
| Bluebird | `B f g x = f (g x)`     | `compose`      |
| Queer    | `Q f g x = g (f x)`     | `pipe`         |
| Cardinal | `C f x y = f y x`       | `flip`         |
| Kestrel  | `K x y = x`             | `const`        |
| Idiot    | `I x = x`               | `identity`     |
| Starling | `S f g x = f x (g x)`   | `ap`           |
| Psi      | `Ψ f g x y = f(gx)(gy)` | `on`           |
| Phoenix  | `Φ f g h x = f(gx)(hx)` | `converge`     |
| Vireo    | `V x y f = f x y`       | `pair`         |
| Sage     | `Y f = f (Y f)`         | `fix`          |

All thirty-five are implemented. The full aviary, with each bird's definition
and its typing notes, lives in [`src/birds`](./src/birds).

## Install

```sh
pnpm add smullyan
```

## Use

Every combinator is exported under three names — the combinatory **symbol**,
the **bird**, and the familiar **FP name**. They are aliases of one
implementation, so they tree-shake identically. Pick whichever dialect reads
best in your codebase.

```ts
import { B } from 'smullyan/birds';
// or: import { bluebird } from 'smullyan/birds'
// or: import { compose }  from 'smullyan/birds'

const inc = (n: number): number => n + 1;
const show = (n: number): string => String(n);

const incThenShow = B(show)(inc);
incThenShow(1); // '2'
```

Combinators are **curried only** — `B(f)(g)(x)`, never `B(f, g, x)`. That is
the faithful combinatory form, partial application is the entire point of these
functions, and a single call signature keeps inference exact. Overloads would
reintroduce the `unknown`-widening that curried generics are prone to.

## Design

**The `.d.ts` files are the product.** Everything else is in service of them.

- **Zero runtime dependencies**, side-effect free, dual ESM + CJS.
- **Seven subpath entry points** so you tree-shake to exactly what you import.
- **No `any` in published types.** Where variance genuinely requires an escape
  hatch, `unknown` plus a documented, tested narrowing.
- **`isolatedDeclarations`** is enabled, so every combinator is authored as a
  named `interface` plus an annotated `const`. The public type surface is a
  written artifact, not an inference result that drifts between compiler
  releases.

### Testing

Line coverage tells you a function ran. It says nothing about whether its
_type_ is correct — and for this library the type is the whole product. So
there are four layers, all gated in CI:

1. **Runtime tests** — hard-gated at 100% lines, branches, functions, statements.
2. **Positive type assertions** via `expect-type`.
3. **Negative type tests** — `@ts-expect-error` assertions proving that _wrong_
   usage fails to compile. Positive assertions alone pass just as happily
   against a leaked `any`.
4. **Algebraic law tests** via `fast-check`: `C(C(f)) ≡ f`, `S(K)(K) ≡ I`,
   `W(K) ≡ I`, associativity of `B`, and the monad laws for the ADTs.

Layer 4 is where a combinator library earns real confidence.

## The hard forest

Five birds are **not typeable in a simply-typed lambda calculus** — that is a
theorem, not a TypeScript limitation:

| Bird        | Definition          |
| ----------- | ------------------- |
| Mockingbird | `M x = x x`         |
| Lark        | `L x y = x (y y)`   |
| Owl         | `O f g = g (f g)`   |
| Turing      | `U x y = y (x x y)` |
| Sage / Y    | `Y f = f (Y f)`     |

TypeScript's lazily-resolved, self-referential interfaces provide a way
through:

```ts
interface SelfApplicable<A> {
  (x: SelfApplicable<A>): A;
}
export const M = <A>(x: SelfApplicable<A>): A => x(x);
```

Each documents which typing strategy was used and what it costs.
"Fully typesafe" here means honest about the boundary, not pretending there
isn't one. Two boundaries are worth calling out:

- **`M(M)` type-checks and loops forever.** That term is `Ω`, and it has no
  normal form — no implementation could do better. Types rule out type errors,
  not divergence.
- **`Y` here is the Z combinator.** The textbook `Y` diverges under eager
  evaluation; the eta-expanded form is extensionally equal for functions of at
  least one argument, which is every practical use. It still achieves recursion
  through self-application alone, with no named self-reference.

```ts
import { Y } from 'smullyan/birds';

const factorial = Y<number, number>((rec) => (n) => (n <= 1 ? 1 : n * rec(n - 1)));
factorial(5); // 120
```

Some identities are true at runtime but **not expressible** in TypeScript's
type system — `B1 ≡ B B B` needs higher-rank polymorphism. Rather than leave
those as folklore, they are asserted as `@ts-expect-error` facts in the test
suite, so a future compiler release that gains the expressiveness fails the
test loudly.

## Contributing

```sh
pnpm install
pnpm check    # format, lint, typecheck, tests + coverage gate
pnpm ci       # the above, plus build and published-package verification
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/);
allowed types and scopes are declared in `.convco` and enforced by a
commit-msg hook.

## Licence

[MIT](./LICENSE)
