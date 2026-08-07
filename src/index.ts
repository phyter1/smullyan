/**
 * smullyan — a fully typesafe functional programming library for TypeScript.
 *
 * This root entry re-exports the birds and `pipe`/`flow`, whose names are
 * distinct and unambiguous.
 *
 * The ADTs are NOT re-exported here. Import them from their subpaths:
 *
 * ```ts
 * import * as Option from 'smullyan/option'
 * import * as Result from 'smullyan/result'
 * import * as Task from 'smullyan/task'
 * import * as Reader from 'smullyan/reader'
 * ```
 *
 * Two reasons, one principled and one empirical:
 *
 * 1. Each ADT defines `map`, `flatMap`, `match` and `getOrElse`. Flattening
 *    them here would collide, and namespacing them at the root would just be a
 *    second way to spell the subpath import.
 *
 * 2. `export * as Ns from './x'` made rolldown build a namespace object, place
 *    it in a chunk shared with the `x` entry point, and re-export it from there
 *    under a minified name — leaking `export { ... as t }` into the PUBLIC API
 *    of `smullyan/result`. publint and attw both pass such an export, because
 *    it is structurally valid; it is simply not one anybody wrote. The
 *    generated API reference caught it by diffing the built package's real
 *    runtime exports against the documented ones.
 */
export * from './birds/index';
export * from './pipe/index';
