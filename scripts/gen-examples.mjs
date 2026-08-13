/**
 * Generate the Spanish twin of each example by running the codemod.
 *
 * The point of an example existing in two dialects is that the second one is
 * NOT written: it is derived, and `pnpm examples:check` fails if the checked-in
 * copy has drifted from what the codemod produces today. That makes the pair a
 * standing test of the codemod against real code rather than against fixtures.
 *
 * This is also the only place generated output is COMPILED. Four build gates
 * check that the registry is coherent; none of them checked that a translated
 * program still typechecks, which is how three defects survived — namespace
 * members left untranslated, a rename map crossing module boundaries, and no
 * dialect exporting a single type.
 *
 * Formats its own output, for the same reason the dialect generator does:
 * otherwise `format:check` and the drift check disagree forever.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { translate, UntranslatableError } from './translate.mjs';

const ROOT = new URL('..', import.meta.url).pathname;

/** Each example, and the dialects it is generated into. */
const EXAMPLES = [{ source: 'examples/weather/weather.ts', languages: ['es'] }];

let written = 0;
for (const { source, languages } of EXAMPLES) {
  const english = readFileSync(join(ROOT, source), 'utf8');

  for (const lang of languages) {
    let translated;
    try {
      translated = translate(english, 'en', lang);
    } catch (e) {
      if (e instanceof UntranslatableError) {
        console.error(`Cannot translate ${source} into "${lang}":\n\n${e.message}\n`);
        console.error(
          'An example must stay inside the translatable vocabulary — that is what\n' +
            'makes it a test of the codemod. Either use the readable dialect of the\n' +
            'API, which is translated, or add the missing names to the registry.',
        );
        process.exit(1);
      }
      throw e;
    }

    const target = source.replace(/\.ts$/u, `.${lang}.ts`);
    writeFileSync(join(ROOT, target), translated);
    written += 1;
  }
}

execFileSync('pnpm', ['exec', 'oxfmt', 'examples'], { cwd: ROOT, stdio: 'ignore' });

console.log(`examples: ${written} dialect file(s) generated from ${EXAMPLES.length} source(s)`);
