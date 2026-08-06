/**
 * `smullyan/reader` — a computation awaiting an environment.
 *
 * Pure re-export barrel; the implementation lives in `reader.ts` so that it is
 * covered by the coverage gate. See the warning in `vitest.config.ts`.
 */
export { type Reader, of, ask, asks, map, flatMap, ap, flatten, local, run } from './reader';
