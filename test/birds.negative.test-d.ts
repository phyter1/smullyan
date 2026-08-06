import { describe, it } from 'vitest';

import { B, C, I } from '../src/birds/index';

const inc = (n: number) => n + 1;
const show = (n: number) => String(n);

/**
 * NEGATIVE type tests — assertions that WRONG usage FAILS to compile.
 *
 * How the failure mode works, and why it is safe:
 *
 *   `@ts-expect-error` inverts the outcome of the line beneath it.
 *     - line errors   -> directive is "used"   -> suppressed, build passes.
 *     - line COMPILES -> directive is "unused" -> tsc raises
 *       `error TS2578: Unused '@ts-expect-error' directive.` -> build FAILS.
 *
 * So if a regression ever makes invalid usage legal, these tests break loudly.
 * TS2578 is UNCONDITIONAL — it needs no compiler flag (verified against
 * typescript@7.0.2). Never use `@ts-ignore` here: it stays silent when unused
 * and turns the whole suite into a no-op.
 *
 * The real prerequisite is a CONFIG one, not a compiler flag: this file must be
 * inside the `include` of the tsconfig named by `typecheck.tsconfig`. If it is
 * not, tsc never reads it and every assertion below passes vacuously.
 */
describe('B — NEGATIVE type tests', () => {
  it("rejects an argument that does not match the inner function's input", () => {
    // @ts-expect-error string is not assignable to number
    B(show)(inc)('nope');
  });

  it('rejects a mismatched composition seam', () => {
    // @ts-expect-error g returns boolean, but f consumes number
    B(show)((s: string) => s.length > 0)('x');
  });

  it('rejects a non-function in the first position', () => {
    // @ts-expect-error B requires a function, not a number
    B(42);
  });

  it('rejects a non-function in the second position', () => {
    // @ts-expect-error the second argument must be a function
    B(show)(42);
  });

  it('does not silently widen the result to any', () => {
    const r = B(show)(inc)(1);
    // @ts-expect-error the result is string, so assigning it to number must fail
    const n: number = r;
    void n;
  });
});

describe('documented type-system boundaries', () => {
  // These assertions record where TypeScript's type system gives out. They are
  // not bugs in smullyan — each identity below is TRUE and holds at runtime.
  // The @ts-expect-error directives assert that the compiler CANNOT express
  // them, so if a future TypeScript release gains the necessary expressiveness
  // these tests fail loudly and the boundary can be revisited.

  it('B B B is not typeable, though B1 ≡ B B B holds at runtime', () => {
    // Passing B to itself requires instantiating a generic combinator at a
    // polytype — higher-rank polymorphism, which TypeScript lacks. Explicit
    // type arguments do not rescue it: the compiler reports that "'B' could be
    // instantiated with an arbitrary type which could be unrelated to 'number'".
    // @ts-expect-error higher-rank instantiation is not supported
    void B(B)(B);
  });

  it('C I requires explicit instantiation', () => {
    // I must be instantiated at a FUNCTION type for the Cardinal to accept it,
    // and TypeScript will not infer that from the argument position alone.
    // Supplying the type arguments explicitly works — see aviary.test.ts.
    // @ts-expect-error cannot infer that I instantiates at a function type
    void C(I);
  });
});
