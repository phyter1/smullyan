import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import {
  B,
  B1,
  B2,
  B3,
  C,
  CStar,
  D,
  D1,
  D2,
  E,
  F,
  G,
  H,
  I,
  IStar,
  J,
  K,
  KI,
  P,
  Q,
  Q1,
  Q2,
  Q3,
  Q4,
  R,
  V,
  W,
  WStar,
} from '../src/birds/index';

const inc = (n: number): number => n + 1;
const dbl = (n: number): number => n * 2;
const show = (n: number): string => String(n);
const len = (s: string): number => s.length;
const add =
  (a: number) =>
  (b: number): number =>
    a + b;
const sub =
  (a: number) =>
  (b: number): number =>
    a - b;
const cat =
  (a: string) =>
  (b: string): string =>
    a + b;
const cat3 =
  (a: string) =>
  (b: string) =>
  (c: string): string =>
    a + b + c;
const add3 =
  (a: number) =>
  (b: number) =>
  (c: number): number =>
    a + b + c;

describe('aviary batch 2 — runtime', () => {
  // Each chain is applied to completion; partial application alone would leave
  // inner arrows uncovered and drop the 100% function-coverage gate.
  it('V holds a pair', () => {
    expect(V(1)('two')(K)).toBe(1);
    expect(V(1)('two')(KI)).toBe('two');
  });

  it('R applies out of order', () => {
    expect(R('foo')(cat)('bar')).toBe('barfoo');
  });

  it('F holds two values and reverses them', () => {
    expect(F('foo')('bar')(cat)).toBe('barfoo');
  });

  it('Q composes left to right', () => {
    expect(Q(inc)(show)(41)).toBe('42');
  });

  it('Q1 applies x to g, then f', () => {
    expect(Q1(show)(41)(inc)).toBe('42');
  });

  it('Q2 applies x to f, then g', () => {
    expect(Q2(41)(show)(inc)).toBe('42');
  });

  it('Q3 applies f to g, then x', () => {
    expect(Q3(inc)(41)(show)).toBe('42');
  });

  it('Q4 applies g to f, then x', () => {
    expect(Q4(41)(inc)(show)).toBe('42');
  });

  it('B2 composes onto a ternary function', () => {
    expect(B2(show)(add3)(20)(20)(2)).toBe('42');
  });

  it('B3 composes three functions', () => {
    expect(B3(show)(dbl)(inc)(20)).toBe('42');
  });

  it('G combines crosswise', () => {
    expect(G(sub)(len)('abc')(10)).toBe(7);
  });

  it('D transforms the second argument', () => {
    expect(D(add)(39)(len)('abc')).toBe(42);
  });

  it('D1 transforms the third argument', () => {
    expect(D1(add3)(20)(19)(len)('abc')).toBe(42);
  });

  it('D2 transforms both arguments', () => {
    expect(D2(add)(len)('abc')(inc)(38)).toBe(42);
  });

  it('E nests a binary function', () => {
    expect(E(add)(2)(add)(20)(20)).toBe(42);
  });

  it('J nests an accumulating function', () => {
    expect(J(cat)('a')('b')('c')).toBe('acb');
  });

  it('H reuses the first argument as the third', () => {
    expect(H(cat3)('x')('y')).toBe('xyx');
  });

  it('IStar applies', () => {
    expect(IStar(inc)(41)).toBe(42);
  });

  it('WStar duplicates the second argument', () => {
    expect(WStar(cat3)('x')('y')).toBe('xyy');
  });

  it('CStar flips the last two arguments', () => {
    expect(CStar(cat3)('x')('y')('z')).toBe('xzy');
  });
});

describe('aviary batch 2 — algebraic laws', () => {
  // ---- Church-encoded pairs ----------------------------------------------

  test.prop([fc.integer(), fc.string()])('V a b K ≡ a  (first projection)', (a, b) => {
    expect(V(a)(b)(K)).toBe(a);
  });

  test.prop([fc.integer(), fc.string()])('V a b KI ≡ b  (second projection)', (a, b) => {
    expect(V(a)(b)(KI)).toBe(b);
  });

  test.prop([fc.string(), fc.string()])('F a b ≡ V b a', (a, b) => {
    expect(F(a)(b)(cat)).toBe(V(b)(a)(cat));
  });

  // ---- Composition family -------------------------------------------------

  test.prop([fc.integer()])('Q ≡ C B  (left-to-right is flipped right-to-left)', (x) => {
    // Explicit instantiation: passing `B` as a value requires fixing its type
    // parameters, which TypeScript will not infer from the argument position.
    // Unlike `B B B` this IS rank-1, so writing the instantiation out works.
    expect(Q(inc)(show)(x)).toBe(
      C<(n: number) => string, (n: number) => number, (n: number) => string>(B)(inc)(show)(x),
    );
  });

  test.prop([fc.integer()])('B3 f g h ≡ B (B f g) h', (x) => {
    expect(B3(show)(dbl)(inc)(x)).toBe(B(B(show)(dbl))(inc)(x));
  });

  test.prop([fc.integer(), fc.integer()])('D f x g ≡ B (f x) g', (x, y) => {
    expect(D(add)(x)(inc)(y)).toBe(B(add(x))(inc)(y));
  });

  test.prop([fc.integer(), fc.integer(), fc.integer()])(
    'B2 f g ≡ B1 f (g a) shifted one argument deeper',
    (a, b, c) => {
      expect(B2(show)(add3)(a)(b)(c)).toBe(B1(show)(add3(a))(b)(c));
    },
  );

  // ---- The Dovekies collapses to Psi when both transformers agree ---------

  test.prop([fc.string(), fc.string()])('D2 f g g ≡ Ψ f g', (a, b) => {
    expect(D2(sub)(len)(a)(len)(b)).toBe(P(sub)(len)(a)(b));
  });

  // ---- Once-removed birds are their base bird composed with B -------------

  test.prop([fc.integer()])('I* f ≡ I f', (x) => {
    expect(IStar(inc)(x)).toBe(I(inc)(x));
  });

  test.prop([fc.string(), fc.string()])('W* f a ≡ W (f a)', (a, b) => {
    expect(WStar(cat3)(a)(b)).toBe(W(cat3(a))(b));
  });

  test.prop([fc.string(), fc.string(), fc.string()])('C* f a ≡ C (f a)', (a, b, c) => {
    expect(CStar(cat3)(a)(b)(c)).toBe(C(cat3(a))(b)(c));
  });

  test.prop([fc.string(), fc.string(), fc.string()])('C* is its own inverse', (a, b, c) => {
    expect(CStar(CStar(cat3))(a)(b)(c)).toBe(cat3(a)(b)(c));
  });

  // ---- Q-bird symmetries --------------------------------------------------

  test.prop([fc.integer()])('Q1 f g x ≡ Q2 g f x', (x) => {
    expect(Q1(show)(x)(inc)).toBe(Q2(x)(show)(inc));
  });

  test.prop([fc.integer()])('Q3 f g x ≡ Q4 g f x', (x) => {
    expect(Q3(inc)(x)(show)).toBe(Q4(x)(inc)(show));
  });

  // ---- Robin and the Cardinal --------------------------------------------

  test.prop([fc.string(), fc.string()])('R x f y ≡ C f x y', (a, b) => {
    expect(R(a)(cat)(b)).toBe(C(cat)(a)(b));
  });

  // ---- Hummingbird / Warbler relationship ---------------------------------

  test.prop([fc.string(), fc.string()])('H f a b ≡ f a b a', (a, b) => {
    expect(H(cat3)(a)(b)).toBe(cat3(a)(b)(a));
  });

  test.prop([fc.integer(), fc.integer()])('G f g x y ≡ f y (g x)', (x, y) => {
    expect(G(add)(inc)(x)(y)).toBe(add(y)(inc(x)));
  });

  test.prop([fc.integer(), fc.integer(), fc.integer()])('E f x g y z ≡ f x (g y z)', (x, y, z) => {
    expect(E(add)(x)(add)(y)(z)).toBe(add(x)(add(y)(z)));
  });

  test.prop([fc.string(), fc.string(), fc.string()])('J f x y z ≡ f x (f z y)', (x, y, z) => {
    expect(J(cat)(x)(y)(z)).toBe(cat(x)(cat(z)(y)));
  });

  test.prop([fc.integer(), fc.integer(), fc.string()])('D1 f x y g z ≡ f x y (g z)', (x, y, z) => {
    expect(D1(add3)(x)(y)(len)(z)).toBe(add3(x)(y)(len(z)));
  });
});
