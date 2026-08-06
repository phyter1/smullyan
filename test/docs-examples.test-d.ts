import type { bluebird, compose } from '../src/birds/index';

import { describe, it, expectTypeOf } from 'vitest';

import { B, Y } from '../src/birds/index';
import * as Option from '../src/option/option';
import { flow, pipe } from '../src/pipe/pipe';
import * as Reader from '../src/reader/reader';
import * as Result from '../src/result/result';
import * as Task from '../src/task/task';

/**
 * Every non-trivial code example printed in `docs/`, compiled.
 *
 * This exists because a documented example did not compile. The home page and
 * the getting-started guide both showed:
 *
 *   pipe(
 *     Option.fromNullable(input),
 *     Option.map(Number),
 *     Option.filter(Number.isInteger),   // <- does not typecheck
 *     Option.getOrElse(() => 3000),
 *   )
 *
 * `Number.isInteger` is typed `(number: unknown) => boolean`, so it cannot pin
 * the Option's element type: `A` infers as `unknown` and the pipeline's
 * `Option<number>` no longer fits. The example was plausible, published, and
 * wrong.
 *
 * Nothing else catches this. VitePress renders fenced code as text — it never
 * compiles it. The API-reference generator copies TSDoc verbatim. The build,
 * the drift check and the completeness check all passed on a page containing a
 * type error.
 *
 * WHEN YOU ADD AN EXAMPLE TO THE DOCS, ADD IT HERE TOO.
 */

const inc = (n: number): number => n + 1;
const show = (n: number): string => String(n);

describe('docs/index.md — hero', () => {
  it('composition and the Sage bird', () => {
    const incThenShow = B(String)(inc);
    expectTypeOf(incThenShow(41)).toEqualTypeOf<string>();

    const factorial = Y<number, number>((rec) => (n) => (n <= 1 ? 1 : n * rec(n - 1)));
    expectTypeOf(factorial(5)).toEqualTypeOf<number>();
  });

  it('the Option pipeline', () => {
    const raw: string | undefined = undefined;
    const port = pipe(
      Option.fromNullable(raw),
      Option.map(Number),
      Option.filter((n: number) => Number.isInteger(n)),
      Option.getOrElse(() => 3000),
    );
    expectTypeOf(port).toEqualTypeOf<number>();
  });
});

describe('docs/guide/currying.md', () => {
  it('four directions of composition', () => {
    expectTypeOf(pipe(41, inc, show)).toEqualTypeOf<string>();
    expectTypeOf(flow(inc, show)(41)).toEqualTypeOf<string>();
  });

  it('flow accepts a multi-argument first function', () => {
    const add = (a: number, b: number): number => a + b;
    expectTypeOf(flow(add, show)(40, 2)).toEqualTypeOf<string>();
  });
});

describe('docs/guide/option-result.md', () => {
  it('fromThrowable takes an explicit mapper', () => {
    const input = '{}';
    const parsed = Result.fromThrowable(
      () => JSON.parse(input) as unknown,
      (e) => (e instanceof Error ? e.message : 'unknown parse failure'),
    );
    expectTypeOf(parsed).toEqualTypeOf<Result.Result<string, unknown>>();
  });

  it('flatMap unions the error types', () => {
    type IoError = { readonly kind: 'io' };
    type ParseError = { readonly kind: 'parse' };
    const readFile = null as unknown as (p: string) => Result.Result<IoError, string>;
    const parse = null as unknown as (s: string) => Result.Result<ParseError, number>;

    const r = pipe(readFile('x.json'), Result.flatMap(parse));
    expectTypeOf(r).toEqualTypeOf<Result.Result<IoError | ParseError, number>>();
  });

  it('a domain error union needs no base class', () => {
    type ParseError =
      | { readonly kind: 'unexpected-token'; readonly at: number }
      | { readonly kind: 'unterminated-string' };
    const e: Result.Result<ParseError, number> = Result.err({ kind: 'unterminated-string' });
    expectTypeOf(e).toEqualTypeOf<Result.Result<ParseError, number>>();
  });
});

describe('docs/guide/task-reader.md', () => {
  it('TaskResult carries the failure channel in the type', () => {
    const t: Task.Task<number> = Task.of(42);
    const tr = Task.tryCatch(t, (e) => (e instanceof Error ? e.message : 'network failure'));
    expectTypeOf(tr).toEqualTypeOf<Task.TaskResult<string, number>>();
  });

  it('local lifts a reader into a larger environment', () => {
    type Db = { readonly name: string };
    type App = { readonly db: Db };
    const withDb: Reader.Reader<Db, string> = (db) => db.name;
    const inApp = Reader.local((app: App) => app.db)(withDb);
    expectTypeOf(inApp).toEqualTypeOf<Reader.Reader<App, string>>();
  });

  it('a Reader pipeline', () => {
    type Env = { readonly base: number };
    const env: Env = { base: 10 };
    const report = pipe(
      Reader.asks((e: Env) => e.base),
      Reader.map((n: number) => `${String(n)} units`),
      Reader.run(env),
    );
    expectTypeOf(report).toEqualTypeOf<string>();
  });
});

describe('docs/guide/getting-started.md', () => {
  it('aliases are the same function, and the same type', () => {
    expectTypeOf(B).toEqualTypeOf<typeof bluebird>();
    expectTypeOf(B).toEqualTypeOf<typeof compose>();
  });
});
