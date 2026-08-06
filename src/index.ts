/**
 * smullyan — a fully typesafe functional programming library for TypeScript.
 *
 * The birds and `pipe`/`flow` are re-exported directly: their names are
 * distinct and unambiguous.
 *
 * The ADTs are exported as NAMESPACES, not flattened. `Option`, `Result`,
 * `Task` and `Reader` each define `map`, `flatMap`, `match`, `getOrElse` and
 * friends — flattening them here would collide, and picking a winner would be
 * arbitrary. Importing the subpath directly is preferred either way, since it
 * tree-shakes without relying on the bundler seeing through this barrel:
 *
 * ```ts
 * import * as O from 'smullyan/option'
 * import { Option } from 'smullyan'      // also works
 * ```
 */
export * from './birds/index';
export * from './pipe/index';

export * as Option from './option/index';
export * as Result from './result/index';
export * as Task from './task/index';
export * as Reader from './reader/index';
