/**
 * Generate the API reference from source TSDoc, verified against the built
 * package's real runtime exports.
 *
 * WHY THIS EXISTS AND NOT TYPEDOC
 *
 * TypeDoc is built on the TypeScript compiler API — `import ts from
 * 'typescript'`. TypeScript 7.0 does not ship one: its package `exports` maps
 * "." to `./lib/version.cjs`, which exports only `version` and
 * `versionMajorMinor`. TypeDoc 0.28's peer range accordingly tops out at
 * `6.0.x`. The same constraint rules out ts-morph, api-extractor and tsd.
 * (TypeScript 7.1 is expected to ship a new, different API; revisit then.)
 *
 * HOW COMPLETENESS IS GUARANTEED
 *
 * Doc text is extracted from source with a regex, which is fragile in general.
 * It is made safe here by taking the INVENTORY from two different sources, both
 * of them BUILT ARTIFACTS rather than the source the regex reads:
 *
 *   - runtime values: import the .mjs and enumerate Object.keys
 *   - types:          parse the `export { ... }` statement of the .d.mts
 *
 * Any export the regex misses is therefore a hard error, not a silent omission.
 *
 * The second source exists because of a bug this generator originally had:
 * Object.keys on a module yields ONLY runtime values, so every type-only export
 * — Option, Result, and all 36 bird interfaces — was silently absent from the
 * reference. It was found by deliberately editing a TSDoc block and confirming
 * the drift check failed. It did not.
 *
 * Run `pnpm docs:api` to regenerate, `pnpm docs:api:check` to verify freshness.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'docs/reference/api.md');

/** Every subpath entry point, and the dist file its exports are read from. */
const ENTRIES = [
  { name: 'smullyan/birds', stem: 'birds', srcDir: 'src/birds' },
  { name: 'smullyan/agent', stem: 'agent', srcDir: 'src/agent' },
  { name: 'smullyan/pipe', stem: 'pipe', srcDir: 'src/pipe' },
  { name: 'smullyan/option', stem: 'option', srcDir: 'src/option' },
  { name: 'smullyan/result', stem: 'result', srcDir: 'src/result' },
  { name: 'smullyan/task', stem: 'task', srcDir: 'src/task' },
  { name: 'smullyan/reader', stem: 'reader', srcDir: 'src/reader' },
];

/**
 * Type-only exports of an entry point, read from its emitted .d.mts.
 *
 * Matches the names in the file's `export { ... }` statements, keeping those
 * marked `type`. Aliased forms (`X as Y`) contribute the EXPORTED name.
 */
const typeExportsOf = (stem) => {
  const dts = readFileSync(join(ROOT, `dist/${stem}.d.mts`), 'utf8');
  const names = new Set();
  for (const block of dts.matchAll(/export\s*(?:type\s*)?\{([^}]*)\}/g)) {
    for (const raw of block[1].split(',')) {
      const part = raw.trim();
      if (!part) continue;
      const isType = /^type\s/.test(part);
      const alias = /\bas\s+([A-Za-z_$][\w$]*)$/.exec(part);
      const name = alias ? alias[1] : part.replace(/^type\s+/, '').trim();
      if (isType && /^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
    }
  }
  return [...names];
};

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : [];
  });

/** Strip the leading ` * ` from a TSDoc block and drop the fences. */
const cleanDoc = (raw) =>
  raw
    .replace(/^\/\*\*\s*/, '')
    .replace(/\s*\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*ted?\s?/, '').replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();

/** First sentence of a doc block, for the summary table. */
const summarise = (doc) => {
  const body = doc
    .split('\n')
    .filter((l) => !l.startsWith('@') && !l.startsWith('```'))
    .join(' ');
  const m = /^(.*?[.!?])(\s|$)/.exec(body.trim());
  return (m ? m[1] : body.trim().slice(0, 120)).replaceAll(/\s+/g, ' ');
};

/**
 * Read a complete declaration starting at `from`.
 *
 * A regex to end-of-line is not enough: an `interface` body spans lines, and a
 * `const`'s type annotation frequently does too. Truncating at the newline
 * produced entries whose entire signature was `interface Bluebird {` — which is
 * the one thing an API reference exists to show.
 *
 * Scans with a brace/paren/bracket depth counter and stops at:
 *   interface     the matching closing brace
 *   type          the `;` at depth 0
 *   const         the `=` at depth 0 (the value is not part of the signature)
 */
const readDeclaration = (text, from, kind) => {
  let depth = 0;
  for (let i = from; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '{' || ch === '(' || ch === '[') depth += 1;
    else if (ch === '}' || ch === ')' || ch === ']') {
      depth -= 1;
      if (kind === 'interface' && depth === 0) return text.slice(from, i + 1);
    } else if (depth === 0) {
      if (kind === 'type' && ch === ';') return text.slice(from, i);
      // An arrow type contains `=`, so only a STANDALONE assignment ends the
      // annotation. Without this, `const map: <A, B>(f: (a: A) => B) => ...`
      // was truncated at the first `=>`.
      if (
        kind === 'const' &&
        ch === '=' &&
        text[i + 1] !== '>' &&
        text[i + 1] !== '=' &&
        !['=', '!', '<', '>', '+', '-', '*', '/', '&', '|'].includes(text[i - 1])
      ) {
        return text.slice(from, i);
      }
    }
  }
  return text.slice(from, text.indexOf('\n', from));
};

/**
 * Extract documented declarations from a source file.
 * Matches a TSDoc block immediately followed by an exported const/interface/type.
 */
const parseFile = (file) => {
  const text = readFileSync(file, 'utf8');
  const out = new Map();
  const re =
    /(\/\*\*[\s\S]*?\*\/)\s*export\s+(?:declare\s+)?(const|interface|type)\s+([A-Za-z_$][\w$]*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const [, rawDoc, kind, name] = m;
    const tail = readDeclaration(text, re.lastIndex, kind);
    const doc = cleanDoc(rawDoc);
    out.set(name, {
      name,
      kind,
      doc,
      summary: summarise(doc),
      signature: `${kind} ${name}${tail.trimEnd()}`,
      file: relative(ROOT, file),
    });
  }
  return out;
};

// Keyed by name -> list of definitions, because the SAME name is exported by
// several modules: Option.map, Result.map, Task.map and Reader.map are four
// different functions. Keying by name alone made one silently shadow the rest.
const allDocs = new Map();
for (const f of walk(SRC)) {
  for (const [k, v] of parseFile(f)) {
    if (!allDocs.has(k)) allDocs.set(k, []);
    allDocs.get(k).push(v);
  }
}

/** Pick the definition belonging to this entry point, not a same-named sibling. */
const resolve = (name, srcDir) => {
  const candidates = allDocs.get(name);
  if (!candidates) return null;
  // Prefer a definition inside the entry's own directory, ignoring barrels.
  const own = candidates.find((c) => c.file.startsWith(srcDir) && !c.file.endsWith('index.ts'));
  return own ?? candidates.find((c) => !c.file.endsWith('index.ts')) ?? candidates[0];
};

const sections = [];
const missing = [];

for (const entry of ENTRIES) {
  // Sequential on purpose: these are cheap local imports and the loop order
  // determines section order in the generated page.
  // oxlint-disable-next-line eslint/no-await-in-loop
  const mod = await import(pathToFileURL(join(ROOT, `dist/${entry.stem}.mjs`)).href);
  // Runtime values AND type-only exports. Object.keys sees only the former.
  const runtimeExports = [...new Set([...Object.keys(mod), ...typeExportsOf(entry.stem)])].toSorted(
    (a, b) => a.localeCompare(b),
  );

  const rows = [];
  for (const name of runtimeExports) {
    const d = resolve(name, entry.srcDir);
    if (!d) {
      missing.push(`${entry.name} -> ${name}`);
      continue;
    }
    rows.push(d);
  }
  sections.push({ entry, rows, runtimeExports });
}

if (missing.length > 0) {
  console.error('Undocumented runtime exports:\n  ' + missing.join('\n  '));
  console.error('\nEvery export must carry a TSDoc block. This check reads the inventory from');
  console.error('the BUILT package, so it cannot be satisfied by editing the generator.');
  process.exit(1);
}

// Backslash FIRST: escaping `|` introduces backslashes, so doing it the other
// way round would double-escape them and mangle any literal `\` in the text.
/**
 * VitePress compiles markdown as a Vue template, so a bare `<A>` in TSDoc prose
 * parses as an unclosed HTML tag and fails the build. Escape `<` in prose only —
 * fenced blocks and inline code are left alone, because markdown-it already
 * escapes their contents and double-escaping would render literal `&lt;`.
 */
const escapeProse = (md) =>
  md
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part) => (part.startsWith('`') ? part : part.replaceAll('<', '&lt;')))
    .join('');

const esc = (s) => s.replaceAll('\\', '\\\\').replaceAll('|', '\\|').replaceAll('\n', ' ');

let md = `---
# GENERATED FILE — DO NOT EDIT.
# Run \`pnpm docs:api\` to regenerate. Source of truth is the TSDoc in src/.
outline: [2, 3]
---

# API reference

Generated from the TSDoc in \`src/\`, with the export inventory read from the
**built package** at runtime — so anything exported but undocumented fails the
build rather than quietly going missing.

::: info Why not TypeDoc
TypeDoc is built on the TypeScript compiler API, and TypeScript 7.0 does not
ship one — its package \`exports\` maps \`"."\` to a three-line \`version.cjs\`.
TypeDoc's peer range tops out at \`6.0.x\`. The same constraint rules out
ts-morph, api-extractor and tsd. TypeScript 7.1 is expected to ship a new API;
this generator can be retired then.
:::

`;

for (const { entry, rows } of sections) {
  md += `## \`${entry.name}\`\n\n`;
  md += `| Export | Kind | Summary |\n| --- | --- | --- |\n`;
  for (const r of rows) {
    md += `| [\`${r.name}\`](#${r.name.toLowerCase()}) | ${r.kind} | ${esc(r.summary)} |\n`;
  }
  md += `\n`;
  for (const r of rows) {
    md += `### ${r.name}\n\n`;
    md += `\`\`\`ts\n${r.signature}\n\`\`\`\n\n`;
    md += `${escapeProse(r.doc)}\n\n`;
    md += `<sup>Source: [\`${r.file}\`](https://github.com/phyter1/smullyan/blob/main/${r.file})</sup>\n\n`;
  }
}

writeFileSync(OUT, md);
const total = sections.reduce((n, s) => n + s.rows.length, 0);
console.log(
  `wrote ${relative(ROOT, OUT)} — ${total} documented exports across ${sections.length} entry points`,
);
