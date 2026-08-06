# Task and Reader

Two ADTs that model _context_ rather than _shape_: `Task` defers when work
happens, `Reader` defers what it depends on.

## Task — a promise that has not started

```ts
type Task<A> = () => Promise<A>;
```

That thunk is the whole idea. A `Promise` is **eager**: constructing one starts
the work and caches the result. Three things follow, and a `Task` fixes all
three.

|                          | Promise                                  | Task               |
| ------------------------ | ---------------------------------------- | ------------------ |
| Retry                    | Impossible — already settled             | Call it again      |
| Delay                    | Impossible — starts on construction      | Call it when ready |
| Referential transparency | Substituting changes _when_ work happens | Preserved          |

```ts
import * as Task from 'smullyan/task';

let runs = 0;
const t = Task.fromSync(() => ++runs);

// Nothing has happened yet.
await t(); // 1
await t(); // 2
```

A `Promise` in the same position would return `1` twice.

### Task does not fail

`Task<A>` models work that **succeeds** with `A`. If it can fail, say so:

```ts
type TaskResult<E, A> = Task<Result<E, A>>;
```

That keeps the failure channel visible in the type rather than hidden in a
rejection no signature mentions. Cross the boundary with `tryCatch`:

```ts
const fetchUser = Task.tryCatch(
  Task.fromPromise(() => fetch(url).then((r) => r.json() as Promise<User>)),
  (e) => (e instanceof Error ? e.message : 'network failure'),
);

const result = await fetchUser(); // Result<string, User>
```

### Concurrency is explicit

```ts
Task.all([a, b, c]); // concurrent — Promise.all
Task.sequential([a, b, c]); // one at a time, each after the last settles
```

`ap` is concurrent too, because its two arguments are independent:

```ts
Task.ap(taskOfFunction)(taskOfValue); // both start together
```

`flatMap` is necessarily sequential — the second task is computed _from_ the
first's result, so there is nothing to overlap.

### There is no `Task.delay`

Delaying needs `setTimeout`, which is a **host** API rather than an ECMAScript
one. Including it would force `lib` to be widened or `@types/node` added, and
the published `.d.ts` would then carry an ambient dependency — which `types: []`
exists to prevent.

It is one line where the host is known:

```ts
const delay =
  (ms: number) =>
  <A>(fa: Task<A>): Task<A> =>
  async () => {
    await new Promise((r) => setTimeout(r, ms));
    return fa();
  };
```

## Reader — dependency injection without a framework

```ts
type Reader<R, A> = (r: R) => A;
```

A function from an environment to a value. Naming it is what makes the
operations visible:

```ts
import * as Reader from 'smullyan/reader';
import { pipe } from 'smullyan/pipe';

type Env = { readonly db: Db; readonly now: () => Date };

const userCount: Reader<Env, number> = (env) => env.db.count('users');

const report = pipe(
  userCount,
  Reader.map((n) => `${n} users`),
  Reader.run(env),
);
```

`flatMap` hands the **same** environment to both layers — which is precisely
what makes it injection rather than plain composition:

```ts
Reader.flatMap((n: number) => Reader.asks((e: Env) => `${n} at ${e.now()}`));
```

### `local` runs a reader in a bigger environment

```ts
const withDb: Reader<Db, string> = (db) => db.name;

// Lift it into an environment that merely contains a Db.
const inApp: Reader<App, string> = Reader.local((app: App) => app.db)(withDb);
```

The environment maps **backwards** — that is contravariance, and it is what
lets a component declare the smallest environment it actually needs.

### The birds were about this all along

Reader's operations _are_ combinators from the aviary, applied to functions:

| Reader    | Bird         |
| --------- | ------------ |
| `map`     | Bluebird `B` |
| `ap`      | Starling `S` |
| `flatten` | Warbler `W`  |
| `of`      | Kestrel `K`  |

Every one of those equivalences is asserted as a property test against the
independently written combinator. If either implementation drifts, the law
fails — which is the strongest check in the whole ADT suite.
