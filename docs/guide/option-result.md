# Working with Option and Result

`Option<A>` models a value that may be **absent**. `Result<E, A>` models a
computation that may have **failed, with a reason**. Reach for `Option` when
there is nothing useful to say about why the value is missing, and `Result`
when there is.

## They are plain unions

Neither is a class. Both are discriminated unions:

```ts
type Option<A> = { _tag: 'Some'; value: A } | { _tag: 'None' };
type Result<E, A> = { _tag: 'Ok'; value: A } | { _tag: 'Err'; error: E };
```

Which means they narrow with a bare `switch`, survive `JSON.stringify` and
structured clone, and carry no prototype:

```ts
const o = Option.some(42);
if (o._tag === 'Some') o.value; // narrowed to number
```

You are never locked into the helpers.

## Data-last, so it pipes

```ts
import * as Option from 'smullyan/option';
import { pipe } from 'smullyan/pipe';

pipe(
  Option.fromNullable(input),
  Option.map(Number),
  Option.filter((n: number) => Number.isInteger(n)),
  Option.getOrElse(() => 0),
);
```

`fromNullable` treats **both** `null` and `undefined` as absent, and — this is
the part people get wrong with `??` chains — keeps falsy-but-present values:

```ts
Option.fromNullable(0); // Some(0)
Option.fromNullable(''); // Some('')
Option.fromNullable(false); // Some(false)
Option.fromNullable(null); // None
```

## Fallbacks are thunks

```ts
Option.getOrElse(() => expensiveDefault());
```

The fallback is a function so it is **not evaluated when the value is present**.
That matters when producing it is costly, or throws.

## Result: the error type comes first

```ts
Result<E, A>; // not Result<A, E>
```

Type parameters apply left to right, so error-first is what makes partial
application work:

```ts
type Parsed<A> = Result<ParseError, A>;
```

Rust chose the opposite order; fp-ts's `Either<E, A>` did not. In a language
without higher-kinded types, being able to fix the error type is worth more
than matching `Promise<A>`'s reading order.

## Err carries whatever you want

There is no error base class and no `cause` chain. `Err<E>` holds a string, an
enum, an `Error`, or your own union:

```ts
type ParseError =
  | { readonly kind: 'unexpected-token'; readonly at: number }
  | { readonly kind: 'unterminated-string' };

const r: Result<ParseError, Ast> = parse(input);
```

The moment a library defines an error class, every consumer inherits its
opinions about identity, serialisation and stack capture. A bare `E` supports
discriminated unions directly, and `Result<Error, A>` remains available if you
want `Error` semantics.

### The consequence: `fromThrowable` makes you decide

```ts
Result.fromThrowable(
  () => JSON.parse(input) as unknown,
  (e) => (e instanceof Error ? e.message : 'unknown parse failure'),
);
```

JavaScript lets you `throw` anything, so a `catch` binding is genuinely
`unknown` — not `Error`. Rather than cast that lie away, the signature asks for
a mapper. There is deliberately no one-argument overload.

## Errors accumulate through a chain

`flatMap` **unions** the error types rather than requiring them to match, so a
pipeline collects its distinct failure modes without a common base type:

```ts
declare const readFile: (p: string) => Result<IoError, string>;
declare const parse: (s: string) => Result<ParseError, Ast>;

const r = pipe(readFile('x.json'), Result.flatMap(parse));
// Result<IoError | ParseError, Ast>
```

## Traversal short-circuits

```ts
Option.sequence([Option.some(1), Option.none]); // None
Result.sequence([Result.ok(1), Result.err('a'), Result.err('b')]); // Err('a')
```

Both stop at the first failure. If you need _every_ error, that is a validation
applicative rather than a monad — a different type with a different `ap`, and
not something this library currently provides.

## Choosing between them

| Use      | When                                                                                    |
| -------- | --------------------------------------------------------------------------------------- |
| `Option` | The absence carries no information. Map lookups, optional config, first-match searches. |
| `Result` | The caller needs to know _why_. Parsing, validation, I/O, anything a user sees.         |

Converting is direct: `Result.fromNullable(() => myError)` goes one way, and
`Result.match(() => Option.none, Option.some)` goes the other.
