# Where the types give out

"Fully typesafe" is a claim worth being precise about. Some things in this
library are true at runtime and **not expressible** in TypeScript's type system.
Those boundaries are asserted as compile-time facts rather than buried in
comments, so that a future compiler release which removes a limitation makes a
test fail loudly.

## Self-application needs a recursive type

Five birds apply a term to itself. None are typeable in a simply-typed lambda
calculus — that is a theorem about the calculus, not a shortcoming of
TypeScript.

```
M x = x x            Mockingbird
L x y = x (y y)      Lark
O f g = g (f g)      Owl
U x y = y (x x y)    Turing
Y f = f (Y f)        Sage
```

TypeScript gets through because `interface` declarations resolve **lazily** and
may reference themselves:

```ts
export interface SelfApplicable<A> {
  (x: SelfApplicable<A>): A;
}

export const M = <A>(x: SelfApplicable<A>): A => x(x);
```

This is legal here and impossible in Hindley–Milner without an explicit
iso-recursive wrapper (Haskell's `newtype Mu`). It is one of the few places
TypeScript's structural, equirecursive system is genuinely _more_ expressive.

::: warning The Owl is the odd one out
The Owl is grouped with this family by tradition, but it is perfectly
simply-typeable — no self-application appears in its definition. The recursion
people associate with it comes from what you pass it. `O ≡ S I`.
:::

## Types do not rule out divergence

```ts
M(M); // type-checks, and loops forever
```

That term is `Ω`. It has no normal form, so no implementation could do better.
A type system in a Turing-complete language cannot promise termination, and this
one does not pretend to.

## `Y` here is the Z combinator

The textbook fixed point is:

```
Y = λf. (λx. f (x x)) (λx. f (x x))
```

Correct under lazy evaluation, and it stack-overflows immediately under eager
evaluation: computing `f (x x)` forces `x x` before `f` can decide whether it
needs it. JavaScript is eager.

The fix is eta-expansion — wrapping the recursive call so it is forced only when
an argument arrives:

```
Z = λf. (λx. f (λv. x x v)) (λx. f (λv. x x v))
```

`Z` is extensionally equal to `Y` for functions of at least one argument, which
is every practical use. What is shipped is `Z`, implemented through genuine
self-application:

```ts
export const Y: Sage = <A, B>(f) => {
  const rec: SageSelf<A, B> = (x) => (a) => f(x(x))(a);
  return rec(rec);
};
```

Deliberately **not** this:

```ts
const fix = (f) => {
  const g = (a) => f(g)(a);
  return g;
}; // not a combinator
```

That works, but `g` refers to itself by name — ordinary recursion wearing a
combinator's clothes. The whole point of the Sage bird is recursion _without_
self-reference.

`U U` — the Turing fixed point — is not exported for the same eager-evaluation
reason.

## `B1 ≡ B B B` is true and inexpressible

The classical derivation of the Blackbird holds at runtime:

```ts
B1(f)(g)(x)(y) === B(B)(B)(f)(g)(x)(y); // true
```

But `B(B)(B)` does not typecheck, and **explicit type arguments do not rescue
it**:

```
'B' could be instantiated with an arbitrary type which could be unrelated to 'number'
```

Passing `B` to itself requires it to stay _polymorphic_ in an argument
position — rank-2 polymorphism, which TypeScript does not have. No single
instantiation exists to write down.

The law suite asserts the rank-1 equivalent `B1 f g x ≡ B f (g x)` instead, and
the boundary itself is pinned in `test/birds.negative.test-d.ts`:

```ts
// @ts-expect-error higher-rank instantiation is not supported
void B(B)(B);
```

If a future TypeScript gains the expressiveness, that test fails and the note
gets revisited.

### A related but weaker limitation

`C(I)` and `S(I)` also fail to infer — `I` must be instantiated at a _function_
type, and TypeScript will not deduce that from an argument position. Unlike
`B B B`, these are rank-1, so writing the instantiation out works:

```ts
C<(n: number) => number, number, number>(I)(x)(inc);
```

The difference is worth internalising: the first is an **inference** limitation
with a workaround; the second is an **expressiveness** limitation with none.
Annotations can always help a rank-1 system along — until what you need is
genuinely rank-2.
