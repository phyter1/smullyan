/**
 * Generate the aviary reference table from source.
 *
 * The combinatory definition of each bird (`B f g x = f (g x)`) lives in a
 * fenced ```text block at the top of its TSDoc. This reads those blocks so the
 * table cannot drift from the implementations, and cross-checks the bird count
 * against the built package's real exports.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url).pathname;
const BIRDS = join(ROOT, 'src/birds');
const OUT = join(ROOT, 'docs/reference/aviary.md');

/** Files that define no bird. */
const SKIP = new Set(['index.ts', 'self-application.ts']);

/** Grouping, in the order they should be presented. */
const FAMILIES = [
  { title: 'Identity and constants', files: ['idiot', 'kestrel', 'kite'] },
  {
    title: 'Composition',
    files: ['bluebird', 'blackbird', 'bunting', 'becard', 'queer'],
  },
  {
    title: 'Argument manipulation',
    files: ['cardinal', 'warbler', 'thrush', 'robin', 'finch', 'vireo', 'hummingbird', 'jay'],
  },
  {
    title: 'Application and convergence',
    files: ['starling', 'psi', 'phoenix', 'goldfinch'],
  },
  { title: 'The Q-birds', files: ['quixotic', 'quizzical', 'quirky', 'quacky'] },
  { title: 'The D-birds', files: ['dove', 'dickcissel', 'dovekies', 'eagle'] },
  {
    title: 'Once removed',
    files: ['idiot-once-removed', 'warbler-once-removed', 'cardinal-once-removed'],
  },
  {
    title: 'The hard forest',
    files: ['mockingbird', 'lark', 'owl', 'turing', 'sage'],
    note: `These five involve **self-application** and are not typeable in a
simply-typed lambda calculus. See [Where the types give out](../design/type-boundaries)
for how TypeScript expresses them and what it costs.`,
  },
];

const parse = (slug) => {
  const text = readFileSync(join(BIRDS, `${slug}.ts`), 'utf8');

  // Bird name and symbol from the opening line: " * The Bluebird — `B`."
  const header = /\*\s+The ([^—\n]+?)\s+—\s+`([^`]+)`/.exec(text);
  // Combinatory definition from the first ```text fence.
  const def = /```text\n([\s\S]*?)\n\s*\*\s*```/.exec(text);
  // Exported runtime bindings, in declaration order.
  const exports = [...text.matchAll(/export const ([A-Za-z_$][\w$]*)\s*:/g)].map((m) => m[1]);
  // Interface name.
  const iface = /export interface ([A-Za-z_$][\w$]*)/.exec(text);

  if (!header) throw new Error(`${slug}: could not read bird name/symbol from TSDoc header`);
  if (!def) throw new Error(`${slug}: no \`\`\`text definition block found`);

  return {
    slug,
    bird: header[1].trim(),
    symbol: header[2].trim(),
    definition: def[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean)
      .join(' '),
    exports,
    iface: iface ? iface[1] : null,
  };
};

// Every non-skipped source file must appear in exactly one family.
const onDisk = readdirSync(BIRDS)
  .filter((f) => f.endsWith('.ts') && !SKIP.has(f))
  .map((f) => f.replace(/\.ts$/, ''))
  .toSorted();
const claimed = FAMILIES.flatMap((f) => f.files).toSorted();

const missing = onDisk.filter((f) => !claimed.includes(f));
const phantom = claimed.filter((f) => !onDisk.includes(f));
if (missing.length > 0 || phantom.length > 0) {
  if (missing.length > 0) console.error('Birds on disk but not in any family:', missing.join(', '));
  if (phantom.length > 0) console.error('Families reference missing files:', phantom.join(', '));
  process.exit(1);
}

const birds = FAMILIES.map((fam) => Object.assign({}, fam, { entries: fam.files.map(parse) }));
const total = birds.reduce((n, f) => n + f.entries.length, 0);

// Cross-check against the built package: every exported binding must be reachable.
const mod = await import(pathToFileURL(join(ROOT, 'dist/birds.mjs')).href);
const runtime = new Set(Object.keys(mod));
const unreachable = birds
  .flatMap((f) => f.entries)
  .flatMap((b) => b.exports)
  .filter((name) => !runtime.has(name));
if (unreachable.length > 0) {
  console.error('Declared in source but not exported from smullyan/birds:', unreachable.join(', '));
  process.exit(1);
}

let md = `---
# GENERATED FILE — DO NOT EDIT.
# Run \`pnpm docs:aviary\` to regenerate. Source of truth is the TSDoc in src/birds/.
---

# The aviary

All **${total} combinators**, grouped by what they do. Definitions are read
directly from the TSDoc in \`src/birds/\`, so this table cannot drift from the
implementations.

Every bird is curried: \`B(f)(g)(x)\`, never \`B(f, g, x)\`. Each is exported
under its symbol, its bird name, and its familiar FP name where one exists —
all aliases of a single implementation.

`;

for (const fam of birds) {
  md += `## ${fam.title}\n\n`;
  if (fam.note) md += `${fam.note}\n\n`;
  md += `| Bird | Symbol | Definition | Also exported as |\n| --- | --- | --- | --- |\n`;
  for (const b of fam.entries) {
    const aliases = b.exports.slice(1);
    md += `| ${b.bird} | \`${b.symbol}\` | \`${b.definition}\` | ${
      aliases.length > 0 ? aliases.map((a) => `\`${a}\``).join(', ') : '—'
    } |\n`;
  }
  md += `\n`;
}

md += `## Full signatures

Every combinator's complete type, TSDoc and examples are in the
[API reference](./api#smullyan-birds).

## Laws

These identities are asserted as property tests, so the implementations must
agree with each other:

\`\`\`text
S K K   ≡ I          W K ≡ I            C (C f) ≡ f
KI      ≡ C K        KI  ≡ K I          T       ≡ C I
Q       ≡ C B        O   ≡ S I          C*      is its own inverse
D2 f g g ≡ Ψ f g     B3 f g h ≡ B (B f g) h
V a b K ≡ a          V a b KI ≡ b
\`\`\`

Note what is **absent**: the classical \`B1 ≡ B B B\` is true at runtime but not
expressible in TypeScript. See
[Where the types give out](../design/type-boundaries).
`;

writeFileSync(OUT, md);
console.log(`wrote docs/reference/aviary.md — ${total} birds in ${birds.length} families`);
