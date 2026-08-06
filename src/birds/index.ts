/**
 * The aviary — Smullyan's combinatory-logic birds.
 *
 * Each combinator is exported under up to three names: the combinatory symbol
 * (`B`), the bird (`bluebird`), and the familiar FP name (`compose`) where one
 * exists. They are `const` aliases of a single implementation, so they
 * tree-shake identically and cost nothing at runtime.
 *
 * Every combinator is CURRIED — `B(f)(g)(x)`, never `B(f, g, x)`. One call
 * signature per bird keeps inference exact; see the note on generic scoping in
 * `bluebird.ts` before adding a new one.
 *
 * The "once removed" birds use `Star` in their symbol names, since `I*` is not
 * a valid JavaScript identifier.
 */

// --- Identity and constants ------------------------------------------------
export { I, idiot, identity, type Idiot } from './idiot';
export { K, kestrel, constant, type Kestrel } from './kestrel';
export { KI, kite, type Kite } from './kite';

// --- Composition -----------------------------------------------------------
export { B, bluebird, compose, type Bluebird } from './bluebird';
export { B1, blackbird, compose2, type Blackbird } from './blackbird';
export { B2, bunting, type Bunting } from './bunting';
export { B3, becard, compose3, type Becard } from './becard';
export { Q, queer, pipe2, type Queer } from './queer';

// --- Argument manipulation -------------------------------------------------
export { C, cardinal, flip, type Cardinal } from './cardinal';
export { W, warbler, duplicate, type Warbler } from './warbler';
export { T, thrush, applyTo, type Thrush } from './thrush';
export { R, robin, type Robin } from './robin';
export { F, finch, type Finch } from './finch';
export { V, vireo, pair, type Vireo } from './vireo';
export { H, hummingbird, type Hummingbird } from './hummingbird';
export { J, jay, type Jay } from './jay';

// --- Application and convergence -------------------------------------------
export { S, starling, ap, type Starling } from './starling';
export { P, psi, on, type Psi } from './psi';
export { Phi, phoenix, converge, type Phoenix } from './phoenix';
export { G, goldfinch, type Goldfinch } from './goldfinch';

// --- The Q-birds -----------------------------------------------------------
export { Q1, quixotic, type Quixotic } from './quixotic';
export { Q2, quizzical, type Quizzical } from './quizzical';
export { Q3, quirky, type Quirky } from './quirky';
export { Q4, quacky, type Quacky } from './quacky';

// --- The D-birds -----------------------------------------------------------
export { D, dove, type Dove } from './dove';
export { D1, dickcissel, type Dickcissel } from './dickcissel';
export { D2, dovekies, type Dovekies } from './dovekies';
export { E, eagle, type Eagle } from './eagle';

// --- Once removed ----------------------------------------------------------
export { IStar, idiotOnceRemoved, apply, type IdiotOnceRemoved } from './idiot-once-removed';
export { WStar, warblerOnceRemoved, type WarblerOnceRemoved } from './warbler-once-removed';
export { CStar, cardinalOnceRemoved, type CardinalOnceRemoved } from './cardinal-once-removed';
