---
# GENERATED FILE — DO NOT EDIT.
# Run `pnpm docs:aviary` to regenerate. Source of truth is the TSDoc in src/birds/.
---

# The aviary

All **36 combinators**, grouped by what they do. Definitions are read
directly from the TSDoc in `src/birds/`, so this table cannot drift from the
implementations.

Every bird is curried: `B(f)(g)(x)`, never `B(f, g, x)`. Each is exported
under its symbol, its bird name, and its familiar FP name where one exists —
all aliases of a single implementation.

## Identity and constants

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Idiot | `I` | `I x = x` | `idiot`, `identity` |
| Kestrel | `K` | `K x y = x` | `kestrel`, `constant` |
| Kite | `KI` | `KI x y = y` | `kite` |

## Composition

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Bluebird | `B` | `B f g x = f (g x)` | `bluebird`, `compose` |
| Blackbird | `B1` | `B1 f g x y = f (g x y)` | `blackbird`, `compose2` |
| Bunting | `B2` | `B2 f g x y z = f (g x y z)` | `bunting` |
| Becard | `B3` | `B3 f g h x = f (g (h x))` | `becard`, `compose3` |
| Queer bird | `Q` | `Q f g x = g (f x)` | `queer`, `pipe2` |

## Argument manipulation

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Cardinal | `C` | `C f x y = f y x` | `cardinal`, `flip` |
| Warbler | `W` | `W f x = f x x` | `warbler`, `duplicate` |
| Thrush | `T` | `T x f = f x` | `thrush`, `applyTo` |
| Robin | `R` | `R x f y = f y x` | `robin` |
| Finch | `F` | `F x y f = f y x` | `finch` |
| Vireo | `V` | `V x y f = f x y` | `vireo`, `pair` |
| Hummingbird | `H` | `H f x y = f x y x` | `hummingbird` |
| Jay | `J` | `J f x y z = f x (f z y)` | `jay` |

## Application and convergence

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Starling | `S` | `S f g x = f x (g x)` | `starling`, `ap` |
| Psi bird | `Ψ` | `Ψ f g x y = f (g x) (g y)` | `P`, `on` |
| Phoenix | `Φ` | `Φ f g h x = f (g x) (h x)` | `Phi`, `converge` |
| Goldfinch | `G` | `G f g x y = f y (g x)` | `goldfinch` |

## The Q-birds

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Quixotic bird | `Q1` | `Q1 f g x = f (x g)` | `quixotic` |
| Quizzical bird | `Q2` | `Q2 f g x = g (x f)` | `quizzical` |
| Quirky bird | `Q3` | `Q3 f g x = x (f g)` | `quirky` |
| Quacky bird | `Q4` | `Q4 f g x = x (g f)` | `quacky` |

## The D-birds

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Dove | `D` | `D f x g y = f x (g y)` | `dove` |
| Dickcissel | `D1` | `D1 f x y g z = f x y (g z)` | `dickcissel` |
| Dovekies | `D2` | `D2 f g x h y = f (g x) (h y)` | `dovekies` |
| Eagle | `E` | `E f x g y z = f x (g y z)` | `eagle` |

## Once removed

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Idiot once removed | `I*` | `I* f x = f x` | `idiotOnceRemoved`, `apply` |
| Warbler once removed | `W*` | `W* f x y = f x y y` | `warblerOnceRemoved` |
| Cardinal once removed | `C*` | `C* f x y z = f x z y` | `cardinalOnceRemoved` |

## The hard forest

These five involve **self-application** and are not typeable in a
simply-typed lambda calculus. See [Where the types give out](../design/type-boundaries)
for how TypeScript expresses them and what it costs.

| Bird | Symbol | Definition | Also exported as |
| --- | --- | --- | --- |
| Mockingbird | `M` | `M x = x x` | `mockingbird` |
| Lark | `L` | `L x y = x (y y)` | `lark` |
| Owl | `O` | `O f g = g (f g)` | `owl` |
| Turing bird | `U` | `U x y = y (x x y)` | `turing` |
| Sage bird | `Y` | `Y f = f (Y f)` | `sage`, `fix` |

## Full signatures

Every combinator's complete type, TSDoc and examples are in the
[API reference](./api#smullyan-birds).

## Laws

These identities are asserted as property tests, so the implementations must
agree with each other:

```text
S K K   ≡ I          W K ≡ I            C (C f) ≡ f
KI      ≡ C K        KI  ≡ K I          T       ≡ C I
Q       ≡ C B        O   ≡ S I          C*      is its own inverse
D2 f g g ≡ Ψ f g     B3 f g h ≡ B (B f g) h
V a b K ≡ a          V a b KI ≡ b
```

Note what is **absent**: the classical `B1 ≡ B B B` is true at runtime but not
expressible in TypeScript. See
[Where the types give out](../design/type-boundaries).
