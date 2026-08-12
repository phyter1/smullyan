import { defineConfig } from 'tsdown';

/**
 * smullyan build configuration.
 *
 * The `.d.ts` files ARE the product, so every choice here is made in favour of
 * declaration correctness over build speed.
 *
 * Declaration strategy - READ THIS BEFORE CHANGING `dts.generator`:
 *
 *   rolldown-plugin-dts (which tsdown drives) has three generators:
 *     - 'tsc'  - TypeScript JS compiler API. REQUIRES TypeScript 5.x or 6.x.
 *                Unusable here: typescript@7.0.2's package.json `exports` maps
 *                "." to "./lib/version.cjs", which exports only `version` and
 *                `versionMajorMinor`. There is no `ts.createProgram`. The JS
 *                API is expected to return, differently, in TypeScript 7.1.
 *     - 'oxc'  - oxc-transform isolated-declarations emitter. Fast, but it
 *                silently drops `stripInternal`, so @internal helpers would
 *                leak into the published .d.ts.
 *     - 'tsgo' - spawns the TypeScript 7 `tsc` binary. The real TypeScript
 *                declaration emitter, so inference fidelity matches `tsc`.
 *
 *   Selection is pinned to 'tsgo' EXPLICITLY and must stay that way. Because
 *   tsconfig.json enables `isolatedDeclarations`, auto-detection would
 *   otherwise select the oxc emitter and lose stripInternal.
 *
 *   Consequence 1: tsgo IGNORES `dts.tsconfigRaw` and `dts.compilerOptions`.
 *   It is spawned as `tsc --noEmit false --declaration --emitDeclarationOnly
 *   -p <tsconfig> --outDir <tmp> --rootDir <dirname(tsconfig)> --noCheck`.
 *   Every declaration-relevant compiler option must live in
 *   tsconfig.build.json on disk.
 *
 *   Consequence 2 - THE IMPORTANT ONE: tsgo runs under `--noCheck`, and
 *   rolldown-plugin-dts's `spawnAsync` resolves on 'close' WITHOUT reading the
 *   child's exit code. Declaration-emit-only diagnostics (TS4023 "has or is
 *   using name from external module but cannot be named", TS2742 "inferred
 *   type cannot be named without a reference to X") are exactly what deeply
 *   inferred curried generics provoke - and they are suppressed here. The
 *   plugin only throws when an entry's .d.ts is missing ENTIRELY; a type
 *   degraded to `any` ships silently.
 *
 *   `pnpm check:dts-emit` is therefore NOT hygiene. It is the only thing
 *   standing between this pipeline and shipping a broken product, and it must
 *   remain a required, exit-code-gated CI job on every PR.
 */
export default defineConfig({
  // Object form gives flat, deterministic output names:
  //   dist/index.mjs, dist/birds.mjs, dist/option.mjs, ...
  entry: {
    index: 'src/index.ts',
    birds: 'src/birds/index.ts',
    agent: 'src/agent/index.ts',
    option: 'src/option/index.ts',
    result: 'src/result/index.ts',
    task: 'src/task/index.ts',
    reader: 'src/reader/index.ts',
    pipe: 'src/pipe/index.ts',
  },

  format: ['esm', 'cjs'],
  outDir: 'dist',
  clean: true,

  // Pure computation, zero Node built-ins - resolve only via `exports`.
  // (tsdown forces platform 'node' for the CJS output regardless; that is fine.)
  platform: 'neutral',

  // Preserve modern syntax; no downlevelling surprises in the shipped code.
  target: 'es2022',

  // Build-only tsconfig: src/ only, declaration emit on, tests excluded.
  tsconfig: './tsconfig.build.json',

  dts: {
    generator: 'tsgo',

    // OFF: we publish dist/ only, so a .d.mts.map would point at src/*.ts that
    // is not in the tarball. See the matching note in tsconfig.build.json.
    sourcemap: false,

    // Do NOT enable `cjsReexport`. It emits `export type * from './x.d.mts'`
    // into the .d.cts, which re-exports type meanings ONLY. Every combinator
    // here is a runtime value, so CJS consumers would get "cannot be used as a
    // value because it was exported using 'export type'".
    // Removed entirely in tsdown 0.23.
  },

  // REQUIRED, not cosmetic. The tsdown CLI defaults --fail-on-warn to true, and
  // rolldown-plugin-dts unconditionally warns when the tsgo generator is
  // selected. tsdown's logger turns warn into error under failOnWarn and sets
  // process.exitCode = 1, so WITHOUT THIS LINE EVERY SUCCESSFUL BUILD EXITS 1.
  // Setting `failOnWarn: false` here does NOT work: inline CLI config wins the
  // defu merge. suppressWarnings is evaluated before failOnWarn and has no CLI
  // counterpart, so it survives.
  // Delete this once rolldown-plugin-dts stops warning for TS 7.
  suppressWarnings: [/TypeScript 7\.0 does not yet have a stable API/u],

  // OFF for the same reason as dts.sourcemap: dist-only publish.
  sourcemap: false,

  minify: false,
  treeshake: true,

  // Always .mjs/.cjs (and therefore .d.mts/.d.cts). Defaults to true only for
  // platform 'node', so set it explicitly.
  fixedExtension: true,

  // The exports map is hand-written and reviewed in package.json.
  // (false is already the default; stated for intent.)
  exports: false,

  // `publint: true` would resolve to {} and run with publint's defaults
  // (strict: false), which is weaker than the `publint --strict` in
  // scripts/verify-package.sh. Keep the two gates identical.
  publint: { strict: true },

  attw: {
    // node10 cannot resolve subpath exports without `typesVersions`, which is a
    // dead end (tsdown 0.23 drops generating it). 'node16' ignores node10 and
    // still requires node16-cjs, node16-esm and bundler to pass.
    profile: 'node16',
    level: 'error',
  },
});
