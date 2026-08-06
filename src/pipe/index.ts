/**
 * `smullyan/pipe` — left-to-right function application.
 *
 * This file is a pure re-export barrel. The implementation lives in `pipe.ts`
 * so that it is covered by the coverage gate: `vitest.config.ts` excludes
 * `src/**\/index.ts` from coverage on the assumption that index files contain
 * no executable statements. Keep it that way.
 */
export { pipe, flow, type Pipe, type Flow } from './pipe';
