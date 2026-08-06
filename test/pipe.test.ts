import { test, fc } from '@fast-check/vitest';
import { describe, it, expect, expectTypeOf } from 'vitest';

import { B, Q } from '../src/birds/index';
import { flow, pipe } from '../src/pipe/pipe';

const inc = (n: number): number => n + 1;
const dbl = (n: number): number => n * 2;
const show = (n: number): string => String(n);
const len = (s: string): number => s.length;
const add = (a: number, b: number): number => a + b;

describe('pipe — runtime', () => {
  it('returns the value unchanged with no functions', () => {
    expect(pipe(42)).toBe(42);
  });

  it('applies one function', () => {
    expect(pipe(41, inc)).toBe(42);
  });

  it('applies functions left to right', () => {
    expect(pipe(41, inc, show)).toBe('42');
  });

  it('threads through many functions', () => {
    expect(pipe(1, inc, dbl, inc, dbl, show, len)).toBe(2);
  });

  it('changes type at each step', () => {
    expect(pipe(20, inc, dbl, show)).toBe('42');
  });
});

describe('flow — runtime', () => {
  it('composes a single function', () => {
    expect(flow(inc)(41)).toBe(42);
  });

  it('composes left to right', () => {
    expect(flow(inc, show)(41)).toBe('42');
  });

  it('accepts a multi-argument first function', () => {
    expect(flow(add, show)(40, 2)).toBe('42');
  });

  it('composes many functions', () => {
    expect(flow(inc, dbl, inc, dbl, show, len)(1)).toBe(2);
  });
});

describe('pipe / flow — types', () => {
  it('infers the result type exactly at each arity', () => {
    expectTypeOf(pipe(1)).toEqualTypeOf<number>();
    expectTypeOf(pipe(1, inc)).toEqualTypeOf<number>();
    expectTypeOf(pipe(1, inc, show)).toEqualTypeOf<string>();
    expectTypeOf(pipe(1, inc, show, len)).toEqualTypeOf<number>();
  });

  it('infers flow argument and result types', () => {
    expectTypeOf(flow(inc)).toEqualTypeOf<(a: number) => number>();
    expectTypeOf(flow(inc, show)).toEqualTypeOf<(a: number) => string>();
    expectTypeOf(flow(add, show)).toEqualTypeOf<(a: number, b: number) => string>();
  });
});

describe('pipe / flow — algebraic laws', () => {
  test.prop([fc.integer()])('pipe(x) ≡ x  (identity)', (x) => {
    expect(pipe(x)).toBe(x);
  });

  test.prop([fc.integer()])('pipe(x, f) ≡ f(x)', (x) => {
    expect(pipe(x, inc)).toBe(inc(x));
  });

  test.prop([fc.integer()])('pipe(x, f, g) ≡ g(f(x)) ≡ B g f x', (x) => {
    expect(pipe(x, inc, show)).toBe(B(show)(inc)(x));
  });

  test.prop([fc.integer()])('pipe(x, f, g) ≡ Q f g x  (the Queer bird iterated)', (x) => {
    expect(pipe(x, inc, show)).toBe(Q(inc)(show)(x));
  });

  test.prop([fc.integer()])('flow(f, g)(x) ≡ pipe(x, f, g)', (x) => {
    expect(flow(inc, show)(x)).toBe(pipe(x, inc, show));
  });

  test.prop([fc.integer()])('flow is associative in its grouping', (x) => {
    expect(flow(flow(inc, dbl), show)(x)).toBe(flow(inc, flow(dbl, show))(x));
  });

  test.prop([fc.integer()])('pipe distributes over flow', (x) => {
    expect(pipe(x, flow(inc, dbl), show)).toBe(pipe(x, inc, dbl, show));
  });
});
