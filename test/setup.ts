import fc from 'fast-check';

// Deterministic, reproducible property tests.
//
// - CI runs more cases than local for a stronger signal.
// - `seed` is normally unset so each local run explores new space; when a
//   failure appears, fast-check prints the failing seed and path, and you
//   reproduce it exactly with:  FC_SEED=<seed> pnpm test
// - Set FC_SEED in CI (or pin it here) if you require bit-identical runs across
//   builds - the tradeoff is that a fixed seed stops discovering new cases.
// - `endOnFailure` shrinks to a minimal counterexample and stops.
//
// NOTE on the two strictness accommodations below. Both are required by
// tsconfig.base.json and both are worth keeping:
//   - `process.env` is an index signature, so `noPropertyAccessFromIndexSignature`
//     requires bracket access.
//   - `exactOptionalPropertyTypes` means an optional `seed?: number` will NOT
//     accept an explicit `undefined` - the key must be ABSENT, not undefined.
//     Hence the conditional spread rather than `seed: x ? n : undefined`.
const seed = process.env['FC_SEED'];

fc.configureGlobal({
  numRuns: process.env['CI'] === undefined || process.env['CI'] === '' ? 100 : 1000,
  ...(seed === undefined ? {} : { seed: Number(seed) }),
  endOnFailure: true,
  // Surface the counterexample and the seed in the failure output.
  verbose: 1,
});
