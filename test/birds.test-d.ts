import { describe, it, expectTypeOf, assertType } from 'vitest';

import { B } from '../src/birds/index';

const inc = (n: number) => n + 1;
const show = (n: number) => String(n);
const len = (s: string) => s.length;

describe('B — POSITIVE type tests', () => {
  it('infers the composed result type end-to-end', () => {
    expectTypeOf(B(show)(inc)(1)).toEqualTypeOf<string>();
    expectTypeOf(B(inc)(len)('abc')).toEqualTypeOf<number>();
    assertType<string>(B(show)(inc)(1));
  });

  it('infers the intermediate partially-applied shapes', () => {
    // The load-bearing assertion: `A` must still be GENERIC here, not `unknown`.
    // If B's type parameters are mis-scoped this collapses to (a: unknown) => ...
    expectTypeOf(B(show)(inc)).toEqualTypeOf<(a: number) => string>();
    expectTypeOf(B(show)(len)).toEqualTypeOf<(a: string) => string>();
  });

  it('propagates literal and union types without widening', () => {
    const tag = (n: 1 | 2) => (n === 1 ? 'one' : 'two') as 'one' | 'two';
    const pick = (b: boolean): 1 | 2 => (b ? 1 : 2);
    expectTypeOf(B(tag)(pick)(true)).toEqualTypeOf<'one' | 'two'>();
  });

  it('negative assertions via expectTypeOf.not', () => {
    // `.not` fails at COMPILE time when the negation is false.
    expectTypeOf(B(show)(inc)(1)).not.toEqualTypeOf<number>();
    expectTypeOf(B(show)(inc)).not.toEqualTypeOf<(a: unknown) => string>();
    expectTypeOf(B(show)(inc)).parameter(0).not.toBeAny();
    expectTypeOf(B(show)(inc)(1)).not.toBeAny();
  });
});
