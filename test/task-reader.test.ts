import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import { B, K, S, W } from '../src/birds/index';
import { pipe } from '../src/pipe/pipe';
import * as Rd from '../src/reader/reader';
import * as R from '../src/result/result';
import * as T from '../src/task/task';

const inc = (n: number): number => n + 1;
const dbl = (n: number): number => n * 2;

describe('Task — laziness is the whole point', () => {
  it('does not run until invoked', async () => {
    let ran = 0;
    const task = T.fromSync(() => {
      ran += 1;
      return 42;
    });
    expect(ran).toBe(0);
    expect(await task()).toBe(42);
    expect(ran).toBe(1);
  });

  it('can be run more than once, unlike a Promise', async () => {
    let ran = 0;
    const task = T.fromSync(() => {
      ran += 1;
      return ran;
    });
    expect(await task()).toBe(1);
    expect(await task()).toBe(2);
    expect(ran).toBe(2);
  });

  it('map does not start the task', async () => {
    let ran = 0;
    const task = T.fromSync(() => {
      ran += 1;
      return 41;
    });
    const mapped = T.map(inc)(task);
    expect(ran).toBe(0);
    expect(await mapped()).toBe(42);
    expect(ran).toBe(1);
  });
});

describe('Task — transformation', () => {
  it('of lifts a value', async () => {
    expect(await T.of(42)()).toBe(42);
  });

  it('fromPromise wraps a thunk', async () => {
    expect(await T.fromPromise(() => Promise.resolve(42))()).toBe(42);
  });

  it('map applies to the eventual value', async () => {
    expect(await T.map(inc)(T.of(41))()).toBe(42);
  });

  it('flatMap chains', async () => {
    expect(await T.flatMap((n: number) => T.of(n * 2))(T.of(21))()).toBe(42);
  });

  it('ap runs both tasks concurrently', async () => {
    const order: string[] = [];
    const slow = T.fromPromise(async () => {
      await Promise.resolve();
      await Promise.resolve();
      order.push('slow');
      return inc;
    });
    // Deliberately not `async`: the push must happen synchronously on
    // invocation so the ordering assertion below means what it says.
    const fast = T.fromPromise(() => {
      order.push('fast');
      return Promise.resolve(41);
    });
    // If ap were sequential, 'slow' would finish before 'fast' ever started.
    expect(await T.ap(slow)(fast)()).toBe(42);
    expect(order[0]).toBe('fast');
  });
});

describe('Task — running and error capture', () => {
  it('tryCatch turns rejection into Err', async () => {
    const good = T.tryCatch(T.of(42), String);
    expect(await good()).toEqual(R.ok(42));

    const bad = T.tryCatch(
      T.fromPromise(() => Promise.reject(new Error('boom'))),
      (e) => (e instanceof Error ? e.message : 'unknown'),
    );
    expect(await bad()).toEqual(R.err('boom'));
  });

  it('all runs concurrently', async () => {
    const started: number[] = [];
    const mk = (n: number): T.Task<number> =>
      T.fromPromise(async () => {
        started.push(n);
        await Promise.resolve();
        return n;
      });
    expect(await T.all([mk(1), mk(2), mk(3)])()).toEqual([1, 2, 3]);
    // All three began before any resolved.
    expect(started).toEqual([1, 2, 3]);
  });

  it('sequential runs one at a time', async () => {
    const events: string[] = [];
    const mk = (n: number): T.Task<number> =>
      T.fromPromise(async () => {
        events.push(`start${String(n)}`);
        await Promise.resolve();
        events.push(`end${String(n)}`);
        return n;
      });
    expect(await T.sequential([mk(1), mk(2)])()).toEqual([1, 2]);
    expect(events).toEqual(['start1', 'end1', 'start2', 'end2']);
  });

  it('all and sequential agree on empty input', async () => {
    expect(await T.all([])()).toEqual([]);
    expect(await T.sequential([])()).toEqual([]);
  });
});

describe('Reader — the birds in disguise', () => {
  type Env = { readonly base: number };
  const env: Env = { base: 10 };

  it('ask retrieves the environment', () => {
    expect(Rd.ask<Env>()(env)).toBe(env);
  });

  it('asks projects it', () => {
    expect(Rd.asks((e: Env) => e.base)(env)).toBe(10);
  });

  it('local runs in a derived environment', () => {
    type App = { readonly inner: Env };
    const app: App = { inner: env };
    const r: Rd.Reader<Env, number> = (e) => e.base;
    expect(Rd.local((a: App) => a.inner)(r)(app)).toBe(10);
  });

  it('run supplies the environment', () => {
    expect(Rd.run(env)(Rd.asks((e: Env) => e.base))).toBe(10);
  });

  it('flatMap gives both layers the SAME environment', () => {
    const r = Rd.flatMap((n: number) => Rd.asks((e: Env) => n + e.base))(
      Rd.asks((e: Env) => e.base),
    );
    expect(r(env)).toBe(20);
  });

  it('flatten collapses a nested reader', () => {
    const nested: Rd.Reader<Env, Rd.Reader<Env, number>> = (e) => (e2) => e.base + e2.base;
    expect(Rd.flatten(nested)(env)).toBe(20);
  });
});

describe('Reader — equivalences with the aviary', () => {
  // These are the strongest checks in the ADT suite: the Reader operations and
  // the combinators were written independently and must agree exactly.

  test.prop([fc.integer()])('Reader.map ≡ Bluebird B', (x) => {
    const r: Rd.Reader<number, number> = (n) => n * 2;
    expect(Rd.map(inc)(r)(x)).toBe(B(inc)(r)(x));
  });

  test.prop([fc.integer()])('Reader.ap ≡ Starling S', (x) => {
    const rf: Rd.Reader<number, (a: number) => number> = (n) => (m) => n + m;
    const ra: Rd.Reader<number, number> = dbl;
    expect(Rd.ap(rf)(ra)(x)).toBe(S(rf)(ra)(x));
  });

  test.prop([fc.integer()])('Reader.flatten ≡ Warbler W', (x) => {
    const rr: Rd.Reader<number, Rd.Reader<number, number>> = (n) => (m) => n + m;
    expect(Rd.flatten(rr)(x)).toBe(W(rr)(x));
  });

  test.prop([fc.integer(), fc.integer()])('Reader.of ≡ Kestrel K', (a, x) => {
    expect(Rd.of<number, number>(a)(x)).toBe(K(a)(x));
  });
});

describe('Reader — monad laws', () => {
  const f =
    (n: number): Rd.Reader<number, number> =>
    (r) =>
      n + r;
  const g =
    (n: number): Rd.Reader<number, number> =>
    (r) =>
      n * r;

  test.prop([fc.integer(), fc.integer()])('left identity', (a, r) => {
    expect(Rd.flatMap(f)(Rd.of<number, number>(a))(r)).toBe(f(a)(r));
  });

  test.prop([fc.integer()])('right identity', (r) => {
    const m: Rd.Reader<number, number> = inc;
    expect(Rd.flatMap<number, number, number>((a) => Rd.of(a))(m)(r)).toBe(m(r));
  });

  test.prop([fc.integer()])('associativity', (r) => {
    const m: Rd.Reader<number, number> = inc;
    const lhs = Rd.flatMap(g)(Rd.flatMap(f)(m));
    const rhs = Rd.flatMap((a: number) => Rd.flatMap(g)(f(a)))(m);
    expect(lhs(r)).toBe(rhs(r));
  });

  test.prop([fc.integer()])('composes in a pipe', (r) => {
    const result = pipe(
      Rd.asks((e: number) => e + 1),
      Rd.map(dbl),
      Rd.run(r),
    );
    expect(result).toBe((r + 1) * 2);
  });
});

describe('Task — monad laws', () => {
  const f = (n: number): T.Task<number> => T.of(n + 1);
  const g = (n: number): T.Task<number> => T.of(n * 2);

  test.prop([fc.integer()])('left identity', async (x) => {
    expect(await T.flatMap(f)(T.of(x))()).toBe(await f(x)());
  });

  test.prop([fc.integer()])('right identity', async (x) => {
    expect(await T.flatMap<number, number>((a) => T.of(a))(T.of(x))()).toBe(x);
  });

  test.prop([fc.integer()])('associativity', async (x) => {
    const m = T.of(x);
    const lhs = T.flatMap(g)(T.flatMap(f)(m));
    const rhs = T.flatMap((a: number) => T.flatMap(g)(f(a)))(m);
    expect(await lhs()).toBe(await rhs());
  });
});
