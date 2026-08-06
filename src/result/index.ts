/**
 * `smullyan/result` — a computation that either succeeded or failed.
 *
 * Pure re-export barrel; the implementation lives in `result.ts` so that it is
 * covered by the coverage gate. See the warning in `vitest.config.ts`.
 */
export {
  type Result,
  type Ok,
  type Err,
  ok,
  err,
  isOk,
  isErr,
  fromThrowable,
  fromNullable,
  map,
  mapErr,
  flatMap,
  ap,
  flatten,
  match,
  getOrElse,
  orElse,
  sequence,
  traverse,
} from './result';
