import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import * as O from '../src/option/option';
import { pipe } from '../src/pipe/pipe';

const inc = (n: number): number => n + 1;
const dbl = (n: number): number => n * 2;
const show = (n: number): string => String(n);
const isEven = (n: number): boolean => n % 2 === 0;

describe('Option — constructors and refinements', () => {
  it('some wraps a value', () => {
    expect(O.some(42)).toEqual({ _tag: 'Some', value: 42 });
  });

  it('none is a singleton', () => {
    expect(O.none).toEqual({ _tag: 'None' });
  });

  it('isSome / isNone discriminate', () => {
    expect(O.isSome(O.some(1))).toBe(true);
    expect(O.isSome(O.none)).toBe(false);
    expect(O.isNone(O.none)).toBe(true);
    expect(O.isNone(O.some(1))).toBe(false);
  });

  it('narrows with a bare switch on _tag, without any helper', () => {
    const o: O.Option<number> = O.some(42);
    const got = o._tag === 'Some' ? o.value : 0;
    expect(got).toBe(42);
  });
});

describe('Option — interop', () => {
  it('fromNullable treats null and undefined as absent', () => {
    expect(O.fromNullable(1)).toEqual(O.some(1));
    expect(O.fromNullable(null)).toBe(O.none);
    expect(O.fromNullable(undefined)).toBe(O.none);
  });

  it('fromNullable keeps falsy-but-present values', () => {
    // The classic bug this guards against: 0 and '' are NOT absent.
    expect(O.fromNullable(0)).toEqual(O.some(0));
    expect(O.fromNullable('')).toEqual(O.some(''));
    expect(O.fromNullable(false)).toEqual(O.some(false));
  });

  it('fromThrowable captures throws as none', () => {
    expect(O.fromThrowable(() => 42)).toEqual(O.some(42));
    expect(
      O.fromThrowable(() => {
        throw new Error('boom');
      }),
    ).toBe(O.none);
  });

  it('fromPredicate keeps only matching values', () => {
    expect(O.fromPredicate(isEven)(4)).toEqual(O.some(4));
    expect(O.fromPredicate(isEven)(3)).toBe(O.none);
  });

  it('toNullable / toUndefined collapse', () => {
    expect(O.toNullable(O.some(1))).toBe(1);
    expect(O.toNullable(O.none)).toBe(null);
    expect(O.toUndefined(O.some(1))).toBe(1);
    expect(O.toUndefined(O.none)).toBe(undefined);
  });
});

describe('Option — transformation and elimination', () => {
  it('map applies only when present', () => {
    expect(O.map(inc)(O.some(41))).toEqual(O.some(42));
    expect(O.map(inc)(O.none)).toBe(O.none);
  });

  it('flatMap chains', () => {
    const half = (n: number): O.Option<number> => (isEven(n) ? O.some(n / 2) : O.none);
    expect(O.flatMap(half)(O.some(42))).toEqual(O.some(21));
    expect(O.flatMap(half)(O.some(41))).toBe(O.none);
    expect(O.flatMap(half)(O.none)).toBe(O.none);
  });

  it('ap applies a wrapped function', () => {
    expect(O.ap(O.some(inc))(O.some(41))).toEqual(O.some(42));
    expect(O.ap(O.some(inc))(O.none)).toBe(O.none);
    expect(O.ap(O.none as O.Option<(a: number) => number>)(O.some(1))).toBe(O.none);
  });

  it('filter discards non-matching', () => {
    expect(O.filter(isEven)(O.some(4))).toEqual(O.some(4));
    expect(O.filter(isEven)(O.some(3))).toBe(O.none);
    expect(O.filter(isEven)(O.none)).toBe(O.none);
  });

  it('flatten removes one level', () => {
    expect(O.flatten(O.some(O.some(1)))).toEqual(O.some(1));
    expect(O.flatten(O.some(O.none))).toBe(O.none);
    expect(O.flatten(O.none as O.Option<O.Option<number>>)).toBe(O.none);
  });

  it('match handles both branches', () => {
    const f = O.match(
      () => 'absent',
      (n: number) => `got ${String(n)}`,
    );
    expect(f(O.some(1))).toBe('got 1');
    expect(f(O.none)).toBe('absent');
  });

  it('getOrElse does not evaluate the fallback when present', () => {
    let called = 0;
    const fallback = (): number => {
      called += 1;
      return 0;
    };
    expect(O.getOrElse(fallback)(O.some(42))).toBe(42);
    expect(called).toBe(0);
    expect(O.getOrElse(fallback)(O.none)).toBe(0);
    expect(called).toBe(1);
  });

  it('orElse falls back to another Option', () => {
    expect(O.orElse(() => O.some(2))(O.some(1))).toEqual(O.some(1));
    expect(O.orElse(() => O.some(2))(O.none)).toEqual(O.some(2));
  });
});

describe('Option — traversal', () => {
  it('sequence is present only when every element is', () => {
    expect(O.sequence([O.some(1), O.some(2)])).toEqual(O.some([1, 2]));
    expect(O.sequence([O.some(1), O.none])).toBe(O.none);
    expect(O.sequence([])).toEqual(O.some([]));
  });

  it('traverse maps then sequences', () => {
    const evenOnly = (n: number): O.Option<number> => (isEven(n) ? O.some(n) : O.none);
    expect(O.traverse(evenOnly)([2, 4])).toEqual(O.some([2, 4]));
    expect(O.traverse(evenOnly)([2, 3])).toBe(O.none);
  });
});

describe('Option — monad and functor laws', () => {
  const f = (n: number): O.Option<number> => O.some(n + 1);
  const g = (n: number): O.Option<number> => O.some(n * 2);

  test.prop([fc.integer()])('functor identity: map(id) ≡ id', (x) => {
    const id = (n: number): number => n;
    expect(O.map(id)(O.some(x))).toEqual(O.some(x));
  });

  test.prop([fc.integer()])('functor composition: map(g∘f) ≡ map(g)∘map(f)', (x) => {
    expect(O.map((n: number) => dbl(inc(n)))(O.some(x))).toEqual(O.map(dbl)(O.map(inc)(O.some(x))));
  });

  test.prop([fc.integer()])('left identity: flatMap(f)(some(a)) ≡ f(a)', (x) => {
    expect(O.flatMap(f)(O.some(x))).toEqual(f(x));
  });

  test.prop([fc.integer()])('right identity: flatMap(some)(m) ≡ m', (x) => {
    expect(O.flatMap(O.some)(O.some(x))).toEqual(O.some(x));
    expect(O.flatMap(O.some)(O.none)).toBe(O.none);
  });

  test.prop([fc.integer()])('associativity', (x) => {
    const m = O.some(x);
    const lhs = O.flatMap(g)(O.flatMap(f)(m));
    const rhs = O.flatMap((a: number) => O.flatMap(g)(f(a)))(m);
    expect(lhs).toEqual(rhs);
  });

  test.prop([fc.integer()])('composes in a pipe', (x) => {
    const result = pipe(
      O.some(x),
      O.map(inc),
      O.filter(isEven),
      O.map(show),
      O.getOrElse(() => 'odd'),
    );
    expect(result).toBe(isEven(x + 1) ? String(x + 1) : 'odd');
  });
});
