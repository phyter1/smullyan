/**
 * smullyan — a fully typesafe functional programming library for TypeScript.
 *
 * This root entry re-exports the common surface. Importing a subpath directly
 * (`smullyan/birds`, `smullyan/option`, ...) is preferred: every module is
 * side-effect free and the subpaths tree-shake without relying on the
 * bundler seeing through this barrel.
 */
export * from './birds/index';
export * from './pipe/index';
