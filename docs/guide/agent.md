# Tool calls for agents

```ts
import { pipe } from 'smullyan/pipe';
import * as Tool from 'smullyan/agent';
```

`smullyan/agent` is a small layer for the thing agentic systems do constantly and
badly: **call a tool that might fail, and tell the model something useful about
it.**

## The problem

A tool failure has to travel — back through a tool-result envelope, into the
model's context, often across a process boundary, frequently into durable state
so a run can resume. A thrown `Error` survives none of that:
`JSON.stringify(new Error('x'))` is `{}`. And a stringly-typed message gives the
model nothing to branch on, so it retries the identical call and fails
identically.

Everything here is a plain tagged object chosen so that **both a program and a
model can act on it**.

## The vocabulary

```ts
type ToolError =
  | { _tag: 'RateLimited'; retryAfterMs: number; limit?: string }
  | { _tag: 'InvalidArgs'; path: string; expected: string; got: unknown }
  | { _tag: 'NotFound'; searched: string; suggestions?: readonly string[] }
  | { _tag: 'Timeout'; afterMs: number }
  | { _tag: 'Unavailable'; reason: string; status?: number }
  | { _tag: 'Denied'; reason: string; required?: string }
  | { _tag: 'Unknown'; message: string; cause?: unknown };
```

The fields are chosen for what the recipient can _do_. `RateLimited` carries how
long to wait. `InvalidArgs` carries which argument was wrong and what arrived, so
the next call can differ. `NotFound` carries near-misses, so the model tries
something else instead of repeating a failed query.

`explain` turns any of them into a sentence written for a model to read:

```ts
explain(denied('token lacks repo:write', 'repo:write'));
// "Permission denied: token lacks repo:write. Requires: repo:write.
//  Do not retry; this needs a different approach or an escalation."
```

Note that it says what to do, not just what happened.

::: tip Closed on purpose
The union is closed, so `match` is exhaustive and adding a variant is a compile
error at every site that handles one. Two places enforce it — the retryability
table and `explain` — and both fail the build if you add a variant without
deciding its behaviour.
:::

## Reading it back

Anything that crosses a boundary comes back as `unknown`, so `parse` validates
rather than casts:

```ts
const round: unknown = JSON.parse(payload);
pipe(
  Tool.parse(round),
  Option.match(
    () => 'malformed tool error',
    (e) => Tool.explain(e),
  ),
);
```

A malformed envelope is _absence_, not a `ToolError`-shaped lie.

## Writing a tool

Every scalar states its own unit and role, so a call site can be read without
fetching a signature:

```ts
const systemClock: Tool.Sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const { retrying, givingUpAfter } = Tool.withClock(systemClock);

const fetchIssue = pipe(
  Tool.callingApi(() => gh.issues.get(id), asGithubError),
  retrying(
    Tool.whileTransient,
    Tool.upTo(4).attempts,
    Tool.backingOff(Tool.exponentiallyFrom(Tool.millis(100))),
  ),
  givingUpAfter(Tool.seconds(10)),
  Tool.fallingBackTo(Tool.theValue(cached)),
);

const result = await fetchIssue(); // Result<ToolError, Issue>
```

`seconds(10)` cannot be misread as milliseconds. `upTo(4).attempts` settles the
off-by-one — four attempts is one call and three retries. `whileTransient` says
which failures repeat without anyone looking up a default.

Retry clauses are **order-independent**, so there is no positional convention to
remember or get wrong.

## Why the clock is injected

`setTimeout` is a host API, not an ECMAScript one, and this library guarantees
its published declarations carry no ambient dependency. So anything that waits
takes a `Sleep` rather than reaching for a global.

That constraint turned out to be a feature. Backoff schedules are pure data, and
a fake clock makes them **exactly** testable with no wall-clock waiting:

```ts
const waits: number[] = [];
const fake: Tool.Sleep = (ms) => {
  waits.push(ms);
  return Promise.resolve();
};

await pipe(
  flakyTool,
  Tool.withClock(fake).retrying(
    Tool.upTo(3).attempts,
    Tool.backingOff(Tool.exponentiallyFrom(Tool.millis(100))),
  ),
)();

expect(waits).toEqual([100, 200]); // asserted, not slept through
```

::: warning A fake clock is role-specific
An instantly-resolving clock is right for **retry** — you want no waiting — and
wrong for **timeout**, because the deadline then fires immediately and wins every
race. In tests, give the deadline a clock that never resolves. This caught two of
this module's own tests.
:::

## Server advice beats local guessing

When a failure carries its own retry delay, that delay wins over the local
schedule — a server's `Retry-After` is better information than any backoff curve
you picked in advance. Only `RateLimited` carries one, and you can opt out by
name:

```ts
retrying(Tool.upTo(3).attempts, Tool.ignoringServerAdvice);
```

## What it does not do

**It does not cancel work.** `givingUpAfter` bounds how long you _wait_, not how
long the work _runs_ — JavaScript has no general cancellation mechanism, and
pretending otherwise would be a lie. If cancellation matters, the tool itself
must accept an `AbortSignal`.

**It does not retry what cannot succeed.** `InvalidArgs` and `Denied` are not
retryable: the identical call fails identically, burning both budget and context.
Those variants carry enough information for the model to change the call instead,
which is the actual fix.

## Both dialects, one implementation

Everything above has a terser equivalent, exactly as `B` / `bluebird` / `compose`
are one function:

```ts
Tool.retry({ times: 4, backoff: Tool.exponential(100), sleep, retryOn: Tool.isRetryable });
```

The readable dialect is a renaming with no behaviour of its own, and the test
suite asserts the two produce identical results and identical wait schedules.
Prefer the readable one at call sites; reach for the terse one when assembling
policies programmatically.
