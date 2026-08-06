import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import { B, B1, C, I, K, KI, P, Phi, S, T, W } from '../src/birds/index';

// Shared fixtures. Defined at module scope so each law reads as the law and not
// as a pile of setup.
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

describe('aviary — runtime', () => {
  // Every arrow in every curried chain must be INVOKED, not merely partially
  // applied, or v8 function coverage drops below the 100% gate.
  it('I returns its argument', () => {
    expect(I(42)).toBe(42);
    expect(I('x')).toBe('x');
  });

  it('K ignores the second argument', () => {
    expect(K(42)('ignored')).toBe(42);
  });

  it('KI ignores the first argument', () => {
    expect(KI('ignored')(42)).toBe(42);
  });

  it('B composes right to left', () => {
    expect(B(show)(inc)(41)).toBe('42');
  });

  it('B1 composes onto a binary function', () => {
    expect(B1(show)(add)(40)(2)).toBe('42');
  });

  it('C flips argument order', () => {
    expect(cat('foo')('bar')).toBe('foobar');
    expect(C(cat)('foo')('bar')).toBe('barfoo');
  });

  it('W duplicates its argument', () => {
    expect(W(add)(21)).toBe(42);
  });

  it('T applies value-first', () => {
    expect(T(41)(inc)).toBe(42);
  });

  it('S substitutes', () => {
    // n + (n + 1)
    expect(S(add)(inc)(20)).toBe(41);
  });

  it('P (psi) combines on a shared projection', () => {
    expect(P(sub)(len)('aaa')('a')).toBe(2);
  });

  it('Phi (phoenix) converges two functions on one value', () => {
    // (10 + 1) + (10 * 2)
    expect(Phi(add)(inc)(dbl)(10)).toBe(31);
  });
});

describe('aviary — algebraic laws', () => {
  // ---- SKI / BCKW derivations -------------------------------------------
  // These are the load-bearing tests. Each asserts that two independently
  // implemented birds agree, so a typo in one is caught by the other.

  test.prop([fc.integer()])('S K K ≡ I  (the classic SKI derivation)', (x) => {
    expect(S(K)(K)(x)).toBe(I(x));
  });

  test.prop([fc.integer()])('W K ≡ I', (x) => {
    expect(W(K)(x)).toBe(I(x));
  });

  test.prop([fc.string(), fc.integer()])('KI ≡ C K', (a, b) => {
    expect(KI(a)(b)).toBe(C(K)(a)(b));
  });

  test.prop([fc.string(), fc.integer()])('KI ≡ K I', (a, b) => {
    expect(KI(a)(b)).toBe(K(I)(a)(b));
  });

  test.prop([fc.integer()])('T ≡ C I', (x) => {
    // Explicit instantiation required: TypeScript cannot infer that `I` must
    // be instantiated at a function type from the argument position alone.
    expect(T(x)(inc)).toBe(C<(n: number) => number, number, number>(I)(x)(inc));
  });

  // NOTE: the classical derivation is `B1 ≡ B B B`, and it holds at runtime —
  // but it is NOT expressible in TypeScript. Passing `B` to itself requires
  // instantiating a generic combinator at a polytype, i.e. higher-rank
  // polymorphism, which TS lacks; even explicit type arguments fail with
  // "'B' could be instantiated with an arbitrary type". That boundary is
  // recorded as a compile-time fact in birds.negative.test-d.ts.
  //
  // This is the same relationship stated in a rank-1 form: partially applying
  // `g` before composing is exactly what the Blackbird does internally.
  test.prop([fc.integer(), fc.integer()])('B1 f g x ≡ B f (g x)', (a, b) => {
    expect(B1(show)(add)(a)(b)).toBe(B(show)(add(a))(b));
  });

  // ---- Structural identities ---------------------------------------------

  test.prop([fc.string(), fc.string()])('C is its own inverse: C (C f) ≡ f', (a, b) => {
    expect(C(C(cat))(a)(b)).toBe(cat(a)(b));
  });

  test.prop([fc.integer()])('I is a unit for composition', (x) => {
    const id = (n: number): number => n;
    expect(B(inc)(id)(x)).toBe(inc(x));
    expect(B(id)(inc)(x)).toBe(inc(x));
  });

  test.prop([fc.integer()])('composition is associative', (x) => {
    const h = (n: number): number => n - 3;
    expect(B(B(show)(inc))(h)(x)).toBe(B(show)(B(inc)(h))(x));
  });

  test.prop([fc.integer()])('S with a constant second argument ignores it', (x) => {
    // S f (K y) x  ===  f x y
    expect(S(add)(K(5))(x)).toBe(add(x)(5));
  });

  // ---- Relationships between birds ---------------------------------------

  test.prop([fc.string(), fc.string()])('Psi with identity ≡ the raw combiner', (a, b) => {
    const sid = (s: string): string => s;
    expect(P(cat)(sid)(a)(b)).toBe(cat(a)(b));
  });

  test.prop([fc.integer()])('Phi with identity on one branch ≡ S', (x) => {
    const nid = (n: number): number => n;
    expect(Phi(add)(nid)(inc)(x)).toBe(S(add)(inc)(x));
  });

  test.prop([fc.integer()])('W f ≡ Phi f I I', (x) => {
    const nid = (n: number): number => n;
    expect(W(add)(x)).toBe(Phi(add)(nid)(nid)(x));
  });
});
