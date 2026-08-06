import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Runtime tests only. MUST NOT overlap typecheck.include — since Vitest 2.1
    // overlapping patterns register the file twice (once per pool) instead of
    // overriding, which double-counts tests and confuses the coverage map.
    include: ['test/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],

    setupFiles: ['./test/setup.ts'],

    typecheck: {
      enabled: true,
      // Type tests live in *.test-d.ts and are STATICALLY ANALYSED, never executed.
      include: ['test/**/*.test-d.ts'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      // 'tsc' resolves to node_modules/.bin/tsc. Under typescript@7 that binary
      // IS the Go-native compiler — no tsgo/@typescript/native-preview needed.
      checker: 'tsc',
      // Dedicated tsconfig whose `include` COVERS test/**. If the tsconfig handed
      // to tsc does not include the type-test files, tsc checks nothing, Vitest
      // reports "Type Errors  no errors", and the whole negative suite silently
      // passes. This is the single most dangerous misconfiguration here.
      tsconfig: './test/tsconfig.json',
      // Surface type errors originating in src/, not just in test files.
      ignoreSourceErrors: false,
    },

    coverage: {
      provider: 'v8',
      // In Vitest 4 `coverage.include` replaced the old `all` flag. Files matched
      // here are reported even when no test ever imports them (verified: an
      // untested module shows 0% and fails the gate rather than being skipped).
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        // Pure re-export barrels: no executable statements, only inflate counts.
        //
        // WARNING: this exclusion is load-bearing and dangerous. Any file named
        // index.ts is invisible to the coverage gate. If an IMPLEMENTATION is
        // ever written into an index.ts it will be silently unmeasured and the
        // gate will still report 100%. `pipe` was originally written into
        // src/pipe/index.ts and vanished from coverage exactly this way.
        //
        // Rule: index.ts files contain ONLY re-exports. Implementations live in
        // named siblings (birds/bluebird.ts, pipe/pipe.ts, ...).
        'src/index.ts',
        'src/**/index.ts',
      ],
      reporter: ['text', 'lcov', 'json-summary'],
      reportOnFailure: true,
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});
