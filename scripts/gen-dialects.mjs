/**
 * Generate the dialect modules from the translation registry, and enforce the
 * three properties that make mechanical translation trustworthy.
 *
 *   TOTAL       every concept is named in every language
 *   INJECTIVE   within a module, no two concepts share a name
 *   GROUNDED    every concept actually exists in the built package
 *
 * Reversibility — `translate(a -> b -> a) === identity` — is asserted as a
 * property test in test/dialects.test.ts, over real source files.
 *
 * Naturalness is a human question and deliberately NOT checked here. These
 * three are mechanical, and they are what stop a translation from being
 * ambiguous, incomplete, or pointing at something that does not exist.
 *
 * Run `pnpm dialects` to regenerate, `pnpm dialects:check` to verify freshness.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url).pathname;

/**
 * Read the registry without importing TypeScript.
 *
 * The registry is a .ts file and this is a plain .mjs script, so rather than
 * add a compile step it is evaluated as data: the object literals are extracted
 * and parsed. Deliberately strict — anything unparseable is a hard failure, not
 * a silent partial read.
 */
const loadRegistry = () => {
  const src = readFileSync(join(ROOT, 'src/lang/registry.ts'), 'utf8');

  const langs = /export const languages: ReadonlyArray<Language> = \[([^\]]*)\]/.exec(src);
  if (!langs) throw new Error('registry: could not read `languages`');
  const languages = [...langs[1].matchAll(/'([a-z-]+)'/g)].map((m) => m[1]);

  const start = src.indexOf('export const vocabulary: Vocabulary = {');
  if (start === -1) throw new Error('registry: could not find `vocabulary`');
  const open = src.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('registry: unbalanced braces in `vocabulary`');

  const body = src.slice(open, end + 1);
  const vocabulary = {};
  // module: { concept: { en: 'x', es: 'y' }, ... }
  const moduleRe = /(\w+):\s*\{/g;
  let m;
  const moduleStarts = [];
  while ((m = moduleRe.exec(body)) !== null) moduleStarts.push({ name: m[1], at: m.index });

  for (const { name, at } of moduleStarts) {
    // Only top-level modules: those whose brace depth from the start is 1.
    let d = 0;
    for (let i = 0; i < at; i += 1) {
      if (body[i] === '{') d += 1;
      else if (body[i] === '}') d -= 1;
    }
    if (d !== 1) continue;

    const openAt = body.indexOf('{', at);
    let dd = 0;
    let closeAt = -1;
    for (let i = openAt; i < body.length; i += 1) {
      if (body[i] === '{') dd += 1;
      else if (body[i] === '}') {
        dd -= 1;
        if (dd === 0) {
          closeAt = i;
          break;
        }
      }
    }
    const modBody = body.slice(openAt, closeAt + 1);
    const concepts = {};
    for (const c of modBody.matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
      const names = {};
      for (const n of c[2].matchAll(/(\w+):\s*'([^']*)'/g)) names[n[1]] = n[2];
      concepts[c[1]] = names;
    }
    vocabulary[name] = concepts;
  }
  return { languages, vocabulary };
};

const { languages, vocabulary } = loadRegistry();
const failures = [];

// --- GATE 1: total ---------------------------------------------------------
for (const [mod, concepts] of Object.entries(vocabulary)) {
  for (const [concept, names] of Object.entries(concepts)) {
    for (const lang of languages) {
      if (typeof names[lang] !== 'string' || names[lang].length === 0) {
        failures.push(`NOT TOTAL: ${mod}.${concept} has no "${lang}" name`);
      }
    }
  }
}

// --- GATE 2: injective, per module per language -----------------------------
for (const [mod, concepts] of Object.entries(vocabulary)) {
  for (const lang of languages) {
    const seen = new Map();
    for (const [concept, names] of Object.entries(concepts)) {
      const name = names[lang];
      if (seen.has(name)) {
        failures.push(
          `NOT INJECTIVE: ${mod} "${lang}" maps both ${seen.get(name)} and ${concept} to "${name}" — translation would be ambiguous`,
        );
      }
      seen.set(name, concept);
    }
  }
}

// --- GATE 3: globally bijective --------------------------------------------
// Per-module injectivity is not enough. The codemod's rename map is global, so
// if two DIFFERENT English names share one Spanish name the round trip silently
// resolves to the wrong concept. Repeating the SAME pairing across modules
// (map -> mapear everywhere) is fine and expected.
for (const lang of languages) {
  if (lang === 'en') continue;
  const byForeign = new Map();
  const byEnglish = new Map();
  for (const [mod, concepts] of Object.entries(vocabulary)) {
    for (const [concept, names] of Object.entries(concepts)) {
      const foreign = names[lang];
      const priorEnglish = byForeign.get(foreign);
      if (priorEnglish !== undefined && priorEnglish !== concept) {
        failures.push(
          `NOT BIJECTIVE: "${lang}" name "${foreign}" is used for BOTH ${priorEnglish} and ${mod}.${concept} — the codemod could not translate it back unambiguously`,
        );
      }
      byForeign.set(foreign, concept);

      const priorForeign = byEnglish.get(concept);
      if (priorForeign !== undefined && priorForeign !== foreign) {
        failures.push(
          `NOT BIJECTIVE: concept "${concept}" is named both "${priorForeign}" and "${foreign}" in "${lang}" — pick one so the mapping is stable`,
        );
      }
      byEnglish.set(concept, foreign);
    }
  }
}

// --- GATE 4: grounded in the built package ----------------------------------
const DIST = {
  birds: 'birds',
  pipe: 'pipe',
  option: 'option',
  result: 'result',
  task: 'task',
  reader: 'reader',
  agent: 'agent',
};
for (const [mod, concepts] of Object.entries(vocabulary)) {
  const stem = DIST[mod];
  if (stem === undefined) {
    failures.push(`UNGROUNDED: registry module "${mod}" has no dist entry point`);
    continue;
  }
  // Sequential on purpose: one import per module, and failures should be
  // reported in registry order rather than whichever settles first.
  // oxlint-disable-next-line eslint/no-await-in-loop
  const real = await import(pathToFileURL(join(ROOT, `dist/${stem}.mjs`)).href);
  const exported = new Set(Object.keys(real));
  for (const concept of Object.keys(concepts)) {
    if (!exported.has(concept)) {
      failures.push(
        `UNGROUNDED: ${mod}.${concept} is in the registry but not exported by smullyan/${stem}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error('Dialect registry failed its gates:\n  ' + failures.join('\n  '));
  console.error(
    '\nThese are mechanical properties, not style opinions. A translation that is\n' +
      'incomplete, ambiguous, or points at a non-existent export cannot be applied\n' +
      'safely by the codemod.',
  );
  process.exit(1);
}

// --- Generate ---------------------------------------------------------------
let written = 0;
for (const lang of languages) {
  // English is the reference dialect; it needs no alias module.
  if (lang === 'en') continue;
  const dir = join(ROOT, 'src/lang', lang);
  mkdirSync(dir, { recursive: true });

  for (const [mod, concepts] of Object.entries(vocabulary)) {
    const stem = DIST[mod];
    const lines = Object.entries(concepts)
      .map(([concept, names]) => `  ${concept} as ${names[lang]},`)
      .sort((a, b) => a.localeCompare(b))
      .join('\n');

    const body = `// GENERATED FILE — DO NOT EDIT.
// Run \`pnpm dialects\` to regenerate. Source of truth is src/lang/registry.ts.
//
// @experimental This dialect is machine-generated and has NOT been reviewed by
// a native speaker. English is the reference dialect.
export {
${lines}
} from '../../${stem}/index';
`;
    writeFileSync(join(dir, `${mod}.ts`), body);
    written += 1;
  }
}

// Format the generated output here rather than excluding it from oxfmt.
// Otherwise `format:check` and `dialects:check` disagree forever: the formatter
// wants to rewrite the files, and the drift check sees that rewrite as drift.
execFileSync('pnpm', ['exec', 'oxfmt', 'src/lang'], { cwd: ROOT, stdio: 'ignore' });

const total = Object.values(vocabulary).reduce((n, c) => n + Object.keys(c).length, 0);
console.log(
  // Names all four gates above. A summary that under-reports what ran is the
  // same failure as a gate that does not run: you cannot tell from the output.
  `dialects: ${total} concepts x ${languages.length} languages, ${written} modules generated — total, injective, bijective, grounded`,
);
