import { describe, it, expectTypeOf } from 'vitest';

import * as Rd from '../src/reader/reader';
import * as R from '../src/result/result';

/**
 * These assertions exist because of a real bug.
 *
 * `Result.map` was originally declared as
 *
 *   <E, A, B>(f: (a: A) => B) => (fa: Result<E, A>) => Result<E, B>
 *
 * `E` appears nowhere in `f`, so at the first call TypeScript had nothing to
 * infer it from and defaulted it to `unknown`. Every call still compiled, every
 * runtime test still passed, and the error type was silently thrown away —
 * because `Result<E, A>` is COVARIANT in `E`, so `Result<MyError, A>` is
 * assignable to `Result<unknown, A>`.
 *
 * `Reader<R, A>` is CONTRAVARIANT in `R` and failed loudly under the identical
 * mistake, which is how it was found.
 *
 * The rule: scope each type parameter to the call that SUPPLIES it. These tests
 * pin that down so a future edit cannot quietly undo it.
 */

type MyError = { readonly kind: 'boom'; readonly at: number };
type Env = { readonly base: number };

const inc = (n: number): number => n + 1;

describe('Result — generic scoping preserves the error type', () => {
  it('map preserves E', () => {
    const r = null as unknown as R.Result<MyError, number>;
    expectTypeOf(R.map(inc)(r)).toEqualTypeOf<R.Result<MyError, number>>();
    // Would have passed the old, broken signature too — hence the negative
    // assertion below, which is the one that actually has teeth.
    expectTypeOf(R.map(inc)(r)).not.toEqualTypeOf<R.Result<unknown, number>>();
  });

  it('mapErr preserves A', () => {
    const r = null as unknown as R.Result<MyError, number>;
    const f = (e: MyError): string => e.kind;
    expectTypeOf(R.mapErr(f)(r)).toEqualTypeOf<R.Result<string, number>>();
    expectTypeOf(R.mapErr(f)(r)).not.toEqualTypeOf<R.Result<string, unknown>>();
  });

  it('flatMap unions the error types rather than widening them', () => {
    const r = null as unknown as R.Result<MyError, number>;
    const f = (n: number): R.Result<'odd', number> => (n % 2 === 0 ? R.ok(n) : R.err('odd'));
    expectTypeOf(R.flatMap(f)(r)).toEqualTypeOf<R.Result<MyError | 'odd', number>>();
    expectTypeOf(R.flatMap(f)(r)).not.toEqualTypeOf<R.Result<unknown, number>>();
  });

  it('ap unions the error types', () => {
    const rf = null as unknown as R.Result<'fn', (a: number) => number>;
    const ra = null as unknown as R.Result<MyError, number>;
    expectTypeOf(R.ap(rf)(ra)).toEqualTypeOf<R.Result<'fn' | MyError, number>>();
  });
});

describe('Reader — generic scoping preserves the environment', () => {
  it('map preserves R', () => {
    const rd = null as unknown as Rd.Reader<Env, number>;
    expectTypeOf(Rd.map(inc)(rd)).toEqualTypeOf<Rd.Reader<Env, number>>();
    expectTypeOf(Rd.map(inc)(rd)).not.toEqualTypeOf<Rd.Reader<unknown, number>>();
  });

  it('local narrows the environment contravariantly', () => {
    type App = { readonly inner: Env };
    const rd = null as unknown as Rd.Reader<Env, number>;
    expectTypeOf(Rd.local((a: App) => a.inner)(rd)).toEqualTypeOf<Rd.Reader<App, number>>();
  });
});
