import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import { B } from '../src/birds/index';

describe('B (bluebird) — runtime', () => {
  it('composes right-to-left', () => {
    const inc = (n: number) => n + 1;
    const show = (n: number) => String(n);
    expect(B(show)(inc)(1)).toBe('2');
  });

  // Every arrow in the curried chain must be invoked or v8 FUNCTIONS coverage
  // drops below 100. Partial application alone does NOT cover the inner arrows.
  it('is fully applied at every arity', () => {
    const step1 = B((n: number) => String(n));
    const step2 = step1((n: number) => n + 1);
    expect(step2(41)).toBe('42');
  });
});

describe('B (bluebird) — algebraic laws', () => {
  test.prop([fc.integer(), fc.integer(), fc.integer()])(
    'definition: B f g a === f(g(a))',
    (a, j, k) => {
      const g = (n: number) => n + j;
      const f = (n: number) => n * k;
      expect(B(f)(g)(a)).toBe(f(g(a)));
    },
  );

  test.prop([fc.integer(), fc.integer(), fc.integer(), fc.integer()])(
    'composition is associative: B (B f g) h === B f (B g h)',
    (a, i, j, k) => {
      const f = (n: number) => n * i;
      const g = (n: number) => n + j;
      const h = (n: number) => n - k;
      expect(B(B(f)(g))(h)(a)).toBe(B(f)(B(g)(h))(a));
    },
  );

  test.prop([fc.integer()])('identity is a unit for composition', (a) => {
    // Monomorphic on purpose. A polymorphic `<T>(x: T) => T` forces TypeScript
    // to unify two independent type parameters at the assignment site and it
    // resolves them wrongly. The law being asserted here — that identity is a
    // unit on both sides of composition — needs no polymorphism to hold.
    // Polymorphism is covered separately by the "is polymorphic across
    // unrelated types" property below.
    const id = (x: number): number => x;
    const f = (n: number) => n * 3;
    expect(B(f)(id)(a)).toBe(f(a));
    expect(B(id)(f)(a)).toBe(f(a));
  });

  // Record form of test.prop — named arguments, useful for wide laws.
  test.prop({ a: fc.string(), n: fc.integer() })(
    'is polymorphic across unrelated types',
    ({ a, n }) => {
      const len = (s: string) => s.length;
      const add = (m: number) => (x: number) => x + m;
      expect(B(add(n))(len)(a)).toBe(a.length + n);
    },
  );
});
