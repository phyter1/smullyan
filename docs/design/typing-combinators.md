# Typing combinators

There is one rule behind every signature in this library, and it caused three
separate bugs during development before it was written down.

> **Scope each type parameter to the call signature that supplies it.**

## The bug

Here is the Bluebird, typed the obvious way:

```ts
// WRONG
export interface Bluebird {
  <A, B, C>(f: (b: B) => C): (g: (a: A) => B) => (a: A) => C;
}
```

It compiles. It is wrong.

`A` appears nowhere in `f`. At the first call TypeScript has nothing to infer it
from, so it defaults to `unknown` — and every later application fails:

```ts
B(inc)(inc);
// Argument of type '(n: number) => number' is not assignable to
// parameter of type '(a: unknown) => number'.
```

The fix is to move `A` to the call that actually supplies it:

```ts
// RIGHT
export interface Bluebird {
  <B, C>(f: (b: B) => C): <A>(g: (a: A) => B) => (a: A) => C;
}
```

## Why it is dangerous rather than merely annoying

In the Bluebird the mistake is loud — the next call fails to typecheck. In
`Result` the identical mistake was **completely silent**:

```ts
// WRONG, and it does not complain
export const map: <E, A, B>(f: (a: A) => B) => (fa: Result<E, A>) => Result<E, B>;
```

`E` is not in `f`, so it defaults to `unknown`. But `Result<E, A>` is
**covariant** in `E`, so `Result<MyError, A>` is assignable to
`Result<unknown, A>`. Every call compiled. Every runtime test passed. 100%
coverage was green. The error type was silently discarded on every `map`.

It surfaced only because `Reader<R, A>` is **contravariant** in `R`, and the
same mistake there is a hard compile error:

```
Type 'Reader<Env, number>' is not assignable to 'Reader<unknown, number>'
```

Same bug, opposite volume — decided entirely by variance.

## The lesson generalises

A positive type assertion cannot catch this:

```ts
expectTypeOf(R.map(inc)(r)).toEqualTypeOf<Result<MyError, number>>();
```

That passes against the broken signature, because the broken result is
assignable. The assertion with teeth is the **negative** one:

```ts
expectTypeOf(R.map(inc)(r)).not.toEqualTypeOf<Result<unknown, number>>();
```

Both are in `test/adt-scoping.test-d.ts`, on every affected combinator.

## The checklist

When adding a signature, for each type parameter ask: **can TypeScript infer
this from the arguments of the call it is declared on?**

- Yes → leave it there.
- No → move it to the call where it becomes inferable.
- Never → it belongs in an explicit type argument, not in the signature.

Worked examples from the aviary:

```ts
// Bluebird: A only appears with g, so it is scoped to g's call.
<B, C>(f: (b: B) => C): <A>(g: (a: A) => B) => (a: A) => C

// Cardinal: both A and B are recoverable from f, so both stay on call one.
<A, B, C>(f: (a: A) => (b: B) => C): (b: B) => (a: A) => C

// Kestrel: B is only knowable at the second call.
<A>(a: A): <B>(b: B) => A

// Result.map: E arrives with the Result, not with the function.
<A, B>(f: (a: A) => B) => <E>(fa: Result<E, A>) => Result<E, B>
```

## Why one call signature, never overloads

Overload resolution picks the **first matching** signature rather than the best
one, and in partially-applied positions it frequently picks one that widens
generics. That reintroduces exactly the failure above, but through a mechanism
you cannot fix by rescoping.

A single call signature removes the failure mode by construction. The only
exceptions are `pipe` and `flow`, which are variadic and therefore have no
single signature to write.
