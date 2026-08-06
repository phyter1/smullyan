/**
 * The aviary — Smullyan's combinatory-logic birds.
 *
 * Each combinator is exported under three names: the combinatory symbol
 * (`B`), the bird (`bluebird`), and the familiar FP name (`compose`) where one
 * exists. They are `const` aliases of a single implementation, so they
 * tree-shake identically and cost nothing at runtime.
 *
 * Birds with no common FP name (Dovekies, Dickcissel, Becard) export the
 * symbol and the bird name only.
 */
export { B, bluebird, compose, type Bluebird } from './bluebird';
