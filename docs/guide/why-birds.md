# Why birds

In _To Mock a Mockingbird_ (1985), Raymond Smullyan presents combinatory logic
as a forest of birds. Each bird responds to a call with another call, and the
puzzle is to work out which birds must exist given the responses of others.

The conceit hides a complete computational basis. Every bird is a combinator —
a function built only from function application, with no free variables — and a
handful of them can express any computable function at all.

They also turn out to be functions you already use.

## The birds you already know

| Bird     | Combinator                  | You call it |
| -------- | --------------------------- | ----------- |
| Bluebird | `B f g x = f (g x)`         | `compose`   |
| Queer    | `Q f g x = g (f x)`         | `pipe`      |
| Cardinal | `C f x y = f y x`           | `flip`      |
| Kestrel  | `K x y = x`                 | `const`     |
| Idiot    | `I x = x`                   | `identity`  |
| Starling | `S f g x = f x (g x)`       | `ap`        |
| Psi      | `Ψ f g x y = f (g x) (g y)` | `on`        |
| Phoenix  | `Φ f g h x = f (g x) (h x)` | `converge`  |
| Thrush   | `T x f = f x`               | `applyTo`   |
| Vireo    | `V x y f = f x y`           | `pair`      |
| Sage     | `Y f = f (Y f)`             | `fix`       |

If a comparator has ever been written as `sortBy(on(subtract, prop('age')))`,
that is the Psi bird. If an average has been computed as
`converge(divide, [sum, length])`, that is the Phoenix.

## Why keep the bird names at all

Three reasons, in increasing order of usefulness.

**They are precise.** "Compose" is ambiguous about direction — the Bluebird and
the Queer bird are both composition, in opposite orders. `B` and `Q` are not
ambiguous.

**They cover the gaps.** Roughly half the aviary has no common FP name at all.
There is no everyday word for the Dovekies (`D2 f g x h y = f (g x) (h y)`) or
the Dickcissel. Without the bird names these functions are nameless, and
nameless functions get rewritten inline forever.

**They reveal structure.** Once the names are in place, the relationships
between them become statable — and testable:

```
S K K ≡ I          the Starling and two Kestrels make the Identity
W K   ≡ I          so do the Warbler and a Kestrel
C (C f) ≡ f        the Cardinal is its own inverse
KI    ≡ C K        the Kite is a flipped Kestrel
Q     ≡ C B        pipe is flipped compose
```

Every one of those is asserted as a property test in this library. That is the
practical payoff: because the birds relate to each other, a typo in one
implementation is caught by a _different_ bird's law.

## Which basis you actually need

You never need all thirty-six. Two are enough:

- **SK** — the Starling and the Kestrel generate everything, including `I`.
- **BCKW** — the Bluebird, Cardinal, Kestrel and Warbler are an alternative
  basis, closer to how people actually write code.

The rest are conveniences: shapes that recur often enough to deserve a name.

## Naming in this library

Each combinator is exported three ways, and they are the same function:

```ts
import { B, bluebird, compose } from 'smullyan/birds';
B === bluebird; // true
B === compose; // true
```

Use the symbol for point-free code where the combinatory reading matters, the
FP name where a colleague needs to read it at speed, and the bird name when you
want the theme. Birds with no established FP name export the symbol and the
bird only.
