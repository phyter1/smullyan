/**
 * The aviary — Smullyan's combinatory-logic birds.
 *
 * Each combinator is exported under up to three names: the combinatory symbol
 * (`B`), the bird (`bluebird`), and the familiar FP name (`compose`) where one
 * exists. They are `const` aliases of a single implementation, so they
 * tree-shake identically and cost nothing at runtime.
 *
 * Birds with no common FP name export the symbol and the bird name only.
 *
 * Every combinator is CURRIED — `B(f)(g)(x)`, never `B(f, g, x)`. One call
 * signature per bird keeps inference exact; see the note on generic scoping in
 * `bluebird.ts` before adding a new one.
 */

// --- Identity and constants ------------------------------------------------
export { I, idiot, identity, type Idiot } from './idiot';
export { K, kestrel, constant, type Kestrel } from './kestrel';
export { KI, kite, type Kite } from './kite';

// --- Composition -----------------------------------------------------------
export { B, bluebird, compose, type Bluebird } from './bluebird';
export { B1, blackbird, compose2, type Blackbird } from './blackbird';

// --- Argument manipulation -------------------------------------------------
export { C, cardinal, flip, type Cardinal } from './cardinal';
export { W, warbler, duplicate, type Warbler } from './warbler';
export { T, thrush, applyTo, type Thrush } from './thrush';

// --- Application and convergence -------------------------------------------
export { S, starling, ap, type Starling } from './starling';
export { P, psi, on, type Psi } from './psi';
export { Phi, phoenix, converge, type Phoenix } from './phoenix';
