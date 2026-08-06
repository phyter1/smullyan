import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import { pipe } from '../src/pipe/pipe';
import * as R from '../src/result/result';

const inc = (n: number): number => n + 1;
const dbl = (n: number): number => n * 2;
const isEven = (n: number): boolean => n % 2 === 0;

describe('Result — constructors and refinements', () => {
  it('ok and err wrap their payloads', () => {
    expect(R.ok(42)).toEqual({ _tag: 'Ok', value: 42 });
    expect(R.err('boom')).toEqual({ _tag: 'Err', error: 'boom' });
  });

  it('isOk / isErr discriminate', () => {
    expect(R.isOk(R.ok(1))).toBe(true);
    expect(R.isOk(R.err('e'))).toBe(false);
    expect(R.isErr(R.err('e'))).toBe(true);
    expect(R.isErr(R.ok(1))).toBe(false);
  });

  it('carries a bare E — no imposed error class', () => {
    // A plain discriminated union is a first-class error type here.
    type ParseError = { readonly kind: 'parse'; readonly at: number };
    const e: R.Result<ParseError, number> = R.err({ kind: 'parse', at: 3 });
    expect(R.isErr(e) && e.error.at).toBe(3);
  });
});

describe('Result — interop', () => {
  it('fromThrowable captures the thrown value through onThrow', () => {
    expect(R.fromThrowable(() => 42, String)).toEqual(R.ok(42));
    const caught = R.fromThrowable(
      () => {
        throw new Error('boom');
      },
      (e) => (e instanceof Error ? e.message : 'unknown'),
    );
    expect(caught).toEqual(R.err('boom'));
  });

  it('fromThrowable handles non-Error throws honestly', () => {
    // JavaScript allows throwing anything; onThrow receives `unknown`.
    const caught = R.fromThrowable(
      () => {
        throw 'a string';
      },
      (e) => (e instanceof Error ? e.message : `non-error: ${String(e)}`),
    );
    expect(caught).toEqual(R.err('non-error: a string'));
  });

  it('fromNullable maps nullish to the supplied error', () => {
    const f = R.fromNullable(() => 'missing');
    expect(f(1)).toEqual(R.ok(1));
    expect(f(null)).toEqual(R.err('missing'));
    expect(f(undefined)).toEqual(R.err('missing'));
    expect(f(0)).toEqual(R.ok(0));
  });
});

describe('Result — transformation and elimination', () => {
  it('map touches only successes', () => {
    expect(R.map(inc)(R.ok(41))).toEqual(R.ok(42));
    expect(R.map(inc)(R.err('e') as R.Result<string, number>)).toEqual(R.err('e'));
  });

  it('mapErr touches only failures', () => {
    expect(R.mapErr((s: string) => s.length)(R.err('boom'))).toEqual(R.err(4));
    expect(R.mapErr((s: string) => s.length)(R.ok(1) as R.Result<string, number>)).toEqual(R.ok(1));
  });

  it('flatMap chains and unions the error types', () => {
    const half = (n: number): R.Result<'odd', number> => (isEven(n) ? R.ok(n / 2) : R.err('odd'));
    expect(R.flatMap(half)(R.ok(42))).toEqual(R.ok(21));
    expect(R.flatMap(half)(R.ok(41))).toEqual(R.err('odd'));
    expect(R.flatMap(half)(R.err('prior') as R.Result<string, number>)).toEqual(R.err('prior'));
  });

  it('ap fails on the first error', () => {
    expect(R.ap(R.ok(inc))(R.ok(41))).toEqual(R.ok(42));
    expect(R.ap(R.err('fn') as R.Result<string, (a: number) => number>)(R.ok(1))).toEqual(
      R.err('fn'),
    );
    expect(R.ap(R.ok(inc))(R.err('val') as R.Result<string, number>)).toEqual(R.err('val'));
  });

  it('flatten removes one level', () => {
    expect(R.flatten(R.ok(R.ok(1)))).toEqual(R.ok(1));
    expect(R.flatten(R.ok(R.err('inner')))).toEqual(R.err('inner'));
    expect(R.flatten(R.err('outer') as R.Result<string, R.Result<string, number>>)).toEqual(
      R.err('outer'),
    );
  });

  it('match handles both branches', () => {
    const f = R.match(
      (e: string) => `failed: ${e}`,
      (n: number) => `ok ${String(n)}`,
    );
    expect(f(R.ok(1))).toBe('ok 1');
    expect(f(R.err('boom'))).toBe('failed: boom');
  });

  it('getOrElse computes a fallback from the error', () => {
    expect(R.getOrElse((e: string) => e.length)(R.ok(42))).toBe(42);
    expect(R.getOrElse((e: string) => e.length)(R.err('boom'))).toBe(4);
  });

  it('orElse recovers', () => {
    expect(R.orElse(() => R.ok(2))(R.ok(1))).toEqual(R.ok(1));
    expect(R.orElse((e: string) => R.ok(e.length))(R.err('boom'))).toEqual(R.ok(4));
  });
});

describe('Result — traversal', () => {
  it('sequence fails with the first error', () => {
    expect(R.sequence([R.ok(1), R.ok(2)])).toEqual(R.ok([1, 2]));
    expect(R.sequence([R.ok(1), R.err('a'), R.err('b')])).toEqual(R.err('a'));
    expect(R.sequence([])).toEqual(R.ok([]));
  });

  it('traverse maps then sequences', () => {
    const evenOnly = (n: number): R.Result<string, number> => (isEven(n) ? R.ok(n) : R.err('odd'));
    expect(R.traverse(evenOnly)([2, 4])).toEqual(R.ok([2, 4]));
    expect(R.traverse(evenOnly)([2, 3])).toEqual(R.err('odd'));
  });
});

describe('Result — monad and functor laws', () => {
  const f = (n: number): R.Result<string, number> => R.ok(n + 1);
  const g = (n: number): R.Result<string, number> => R.ok(n * 2);

  test.prop([fc.integer()])('functor identity: map(id) ≡ id', (x) => {
    const id = (n: number): number => n;
    expect(R.map(id)(R.ok(x))).toEqual(R.ok(x));
  });

  test.prop([fc.integer()])('functor composition', (x) => {
    expect(R.map((n: number) => dbl(inc(n)))(R.ok(x))).toEqual(R.map(dbl)(R.map(inc)(R.ok(x))));
  });

  test.prop([fc.integer()])('left identity: flatMap(f)(ok(a)) ≡ f(a)', (x) => {
    expect(R.flatMap(f)(R.ok(x))).toEqual(f(x));
  });

  test.prop([fc.integer()])('right identity: flatMap(ok)(m) ≡ m', (x) => {
    expect(R.flatMap(R.ok)(R.ok(x))).toEqual(R.ok(x));
  });

  test.prop([fc.integer()])('associativity', (x) => {
    const m = R.ok(x);
    const lhs = R.flatMap(g)(R.flatMap(f)(m));
    const rhs = R.flatMap((a: number) => R.flatMap(g)(f(a)))(m);
    expect(lhs).toEqual(rhs);
  });

  test.prop([fc.string()])('mapErr identity on failures', (e) => {
    const id = (s: string): string => s;
    expect(R.mapErr(id)(R.err(e))).toEqual(R.err(e));
  });

  test.prop([fc.integer()])('composes in a pipe', (x) => {
    const result = pipe(
      R.ok(x) as R.Result<string, number>,
      R.map(inc),
      R.flatMap((n: number) => (isEven(n) ? R.ok(n) : R.err('odd'))),
      R.getOrElse(() => -1),
    );
    expect(result).toBe(isEven(x + 1) ? x + 1 : -1);
  });
});
