/**
 * `smullyan/option` — a value that may be absent.
 *
 * Pure re-export barrel; the implementation lives in `option.ts` so that it is
 * covered by the coverage gate. See the warning in `vitest.config.ts`.
 */
export {
  // Types
  type Option,
  type Some,
  type None,
  // Constructors
  some,
  none,
  // Refinements
  isSome,
  isNone,
  // Interop
  fromNullable,
  fromThrowable,
  fromPredicate,
  toNullable,
  toUndefined,
  // Transformation
  map,
  flatMap,
  ap,
  filter,
  flatten,
  // Elimination
  match,
  getOrElse,
  orElse,
  // Traversal
  sequence,
  traverse,
} from './option';
