/**
 * Types for the dialect codemod.
 *
 * `translate.mjs` is deliberately plain JavaScript so it can run as a CLI with
 * no build step — the registry it reads is TypeScript, but the script must work
 * before anything is compiled. This declaration gives the test suite real types
 * against it rather than an `any` cast, so the tests fail if the script's shape
 * changes.
 */

/** module -> concept -> language -> name */
export type Vocabulary = Readonly<Record<string, Readonly<Record<string, string>>>>;

/** Read the registry as data, without importing TypeScript. */
export declare const loadVocabulary: () => Vocabulary;

/**
 * A rename map for one direction. Concept identity is the English name, so any
 * pair of languages composes through it.
 */
export declare const renameMap: (
  vocabulary: Vocabulary,
  from: string,
  to: string,
) => Map<string, string>;

/**
 * Translate one source file between dialects.
 *
 * Only identifiers imported from a smullyan module in THIS file are renamed, so
 * an unrelated local called `map` is left alone.
 */
export declare const translate: (
  source: string,
  from: string,
  to: string,
  vocabulary?: Vocabulary,
) => string;
