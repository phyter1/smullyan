import type { SelfApplicable, TuringSelf } from '../src/birds/index';

import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import { I, L, M, O, S, U, Y } from '../src/birds/index';

const inc = (n: number): number => n + 1;
const show = (n: number): string => String(n);

// NOTE on vitest/no-conditional-in-test, disabled for test/** in .oxlintrc.json:
// the ternaries below are BASE CASES of the recursive functions under test, not
// branching in the test itself. A fixed-point combinator cannot be exercised
// without a terminating base case, so the rule has no useful reading here.
describe('hard forest — runtime', () => {
  it('M applies a function to itself', () => {
    // Safe because `answer` ignores its argument, so it terminates.
    // M(M) would also type-check — and would loop forever. That term is Ω.
    const answer: SelfApplicable<number> = (_self) => 42;
    expect(M(answer)).toBe(42);
  });

  it('M can observe the argument it was handed', () => {
    // Proves M really passes the function to ITSELF, rather than to undefined.
    let received: unknown;
    const spy: SelfApplicable<string> = (x) => {
      received = x;
      return 'done';
    };
    expect(M(spy)).toBe('done');
    expect(received).toBe(spy);
  });

  it('L self-applies its second argument', () => {
    const five: SelfApplicable<number> = (_self) => 5;
    expect(L(inc)(five)).toBe(6);
  });

  it('O applies f to g, then g to the result', () => {
    const pick = (_g: (n: number) => string): number => 41;
    expect(O(pick)(show)).toBe('41');
  });

  it('U applies its self-application to the second argument', () => {
    const stop: TuringSelf<number> = (_self) => () => 0;
    expect(U(stop)(inc)).toBe(1);
  });

  it('Y produces a recursive function with no name bound', () => {
    const factorial = Y<number, number>((rec) => (n) => (n <= 1 ? 1 : n * rec(n - 1)));
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
  });

  it('Y supports mutual data recursion (fibonacci)', () => {
    const fib = Y<number, number>((rec) => (n) => (n < 2 ? n : rec(n - 1) + rec(n - 2)));
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(fib)).toEqual([0, 1, 1, 2, 3, 5, 8, 13]);
  });

  it('Y works on non-numeric carriers', () => {
    const repeat = Y<string, string>((rec) => (s) => (s.length >= 6 ? s : rec(s + 'ab')));
    expect(repeat('')).toBe('ababab');
  });
});

describe('hard forest — algebraic laws', () => {
  test.prop([fc.integer({ min: 0, max: 12 })])('Y f is a fixed point: Y f ≡ f (Y f)', (n) => {
    // The defining property. `step` is the non-recursive body; applying it to
    // the fixed point must give the fixed point back.
    const step =
      (rec: (m: number) => number) =>
      (m: number): number =>
        m <= 1 ? 1 : m * rec(m - 1);

    const fixed = Y<number, number>(step);
    expect(step(fixed)(n)).toBe(fixed(n));
  });

  test.prop([fc.integer({ min: 0, max: 15 })])('Y matches ordinary named recursion', (n) => {
    const fibNamed = (m: number): number => (m < 2 ? m : fibNamed(m - 1) + fibNamed(m - 2));
    const fibY = Y<number, number>((rec) => (m) => (m < 2 ? m : rec(m - 1) + rec(m - 2)));
    expect(fibY(n)).toBe(fibNamed(n));
  });

  test.prop([fc.integer()])('O ≡ S I', (x) => {
    const pick = (_g: (n: number) => number): number => x;
    // Explicit instantiation: `I` must be fixed at a function type before the
    // Starling will accept it, exactly as in the `C I` case.
    expect(O(pick)(inc)).toBe(S<(n: number) => number, number, number>(I)(pick)(inc));
  });

  test.prop([fc.integer()])('L f y ≡ f (M y)', (x) => {
    const val: SelfApplicable<number> = (_self) => x;
    expect(L(inc)(val)).toBe(inc(M(val)));
  });

  test.prop([fc.integer()])('M y ≡ y y  (the definition, checked directly)', (x) => {
    const val: SelfApplicable<number> = (_self) => x;
    expect(M(val)).toBe(val(val));
  });
});
