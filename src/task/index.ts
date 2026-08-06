/**
 * `smullyan/task` — a lazy asynchronous computation.
 *
 * Pure re-export barrel; the implementation lives in `task.ts` so that it is
 * covered by the coverage gate. See the warning in `vitest.config.ts`.
 */
export {
  type Task,
  type TaskResult,
  of,
  fromPromise,
  fromSync,
  map,
  flatMap,
  ap,
  tryCatch,
  all,
  sequential,
} from './task';
