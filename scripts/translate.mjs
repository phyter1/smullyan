/**
 * Translate source code between dialects.
 *
 *   node scripts/translate.mjs --from en --to es src/thing.ts
 *   node scripts/translate.mjs --from es --to en --stdin < thing.ts
 *
 * ## Why this is safe here and would not be in a general codebase
 *
 * Renaming identifiers by text substitution is normally reckless. It is sound
 * in this one case because the vocabulary is CLOSED and the gates in
 * gen-dialects.mjs guarantee the mapping is total and injective — so every name
 * has exactly one counterpart and no two concepts collide.
 *
 * The remaining risk is scope: a local variable coincidentally named `map`
 * must not be rewritten. That is handled by only translating identifiers that
 * were actually IMPORTED from a smullyan module in this file, tracked per
 * import statement. A file that does not import from smullyan is untouched.
 *
 * Reversibility is asserted as a property test rather than assumed.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;

/** Load the registry as data. Shares the parsing rules with gen-dialects.mjs. */
export const loadVocabulary = () => {
  const src = readFileSync(new URL('../src/lang/registry.ts', import.meta.url), 'utf8');
  const start = src.indexOf('export const vocabulary: Vocabulary = {');
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
  const body = src.slice(open, end + 1);
  const vocabulary = {};
  for (const c of body.matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
    const names = {};
    for (const n of c[2].matchAll(/(\w+):\s*'([^']*)'/g)) names[n[1]] = n[2];
    if (Object.keys(names).length > 0) vocabulary[c[1]] = names;
  }
  return vocabulary;
};

/**
 * Build a rename map for one direction.
 *
 * Concept identity is the ENGLISH name, so any pair of languages composes
 * through it without needing a direct table.
 */
export const renameMap = (vocabulary, from, to) => {
  const map = new Map();
  for (const names of Object.values(vocabulary)) {
    if (names[from] === undefined || names[to] === undefined) continue;
    map.set(names[from], names[to]);
  }
  return map;
};

/** `smullyan/option` <-> `smullyan/es/option`. English has no path segment. */
const rewriteSpecifier = (spec, from, to) => {
  const stripped = from === 'en' ? spec : spec.replace(`smullyan/${from}/`, 'smullyan/');
  if (!stripped.startsWith('smullyan')) return spec;
  return to === 'en' ? stripped : stripped.replace('smullyan/', `smullyan/${to}/`);
};

/**
 * Translate one source file.
 *
 * Two passes. The first reads every `import ... from 'smullyan...'` statement,
 * collecting the local names bound from a smullyan module and rewriting the
 * specifier. The second renames only those collected names, so an unrelated
 * local called `map` survives untouched.
 */
export const translate = (source, from, to, vocabulary = loadVocabulary()) => {
  const rename = renameMap(vocabulary, from, to);
  const imported = new Set();

  const importRe = /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*(['"])([^'"]+)\2/g;
  let out = source.replace(importRe, (whole, clause, quote, spec) => {
    if (!spec.startsWith('smullyan')) return whole;
    const newSpec = rewriteSpecifier(spec, from, to);
    const newClause = clause.replace(/(\w+)(\s+as\s+\w+)?/g, (bit, name, alias) => {
      const target = rename.get(name);
      if (target === undefined) return bit;
      // With an alias the local name is unchanged; only the imported name moves.
      if (alias !== undefined) return `${target}${alias}`;
      imported.add(name);
      return target;
    });
    return `import ${whole.includes('import type') ? 'type ' : ''}{${newClause}} from ${quote}${newSpec}${quote}`;
  });

  // Namespace imports bind nothing translatable, but the specifier still moves.
  out = out.replace(
    /import\s+\*\s+as\s+(\w+)\s+from\s+(['"])([^'"]+)\2/g,
    (whole, ns, quote, spec) =>
      spec.startsWith('smullyan')
        ? `import * as ${ns} from ${quote}${rewriteSpecifier(spec, from, to)}${quote}`
        : whole,
  );

  if (imported.size === 0) return out;

  // Rename only what this file imported, on word boundaries, skipping property
  // positions (`.map`) and object keys so unrelated members are never touched.
  const names = [...imported].sort((a, b) => b.length - a.length);
  const bodyRe = new RegExp(`(?<![.\\w$])(${names.join('|')})(?![\\w$:])`, 'g');

  const [head, ...rest] = out.split(
    /(?<=\n)(?=(?:const|let|var|function|class|export|type|interface|\/\*\*|\/\/))/,
  );
  void head;
  void rest;
  return out.replace(bodyRe, (name, _g, offset) => {
    // Leave import clauses alone; they were rewritten above.
    const lineStart = out.lastIndexOf('\n', offset) + 1;
    const line = out.slice(lineStart, out.indexOf('\n', offset));
    if (/^\s*import\b/.test(line)) return name;
    return rename.get(name) ?? name;
  });
};

// --- CLI -------------------------------------------------------------------

const isMain = import.meta.url === pathToFileUrlSafe(process.argv[1]);
function pathToFileUrlSafe(p) {
  try {
    return new URL(`file://${p.startsWith('/') ? p : `${ROOT}${p}`}`).href;
  } catch {
    return '';
  }
}

if (isMain) {
  const args = process.argv.slice(2);
  const opt = (flag) => {
    const i = args.indexOf(flag);
    return i === -1 ? undefined : args[i + 1];
  };
  const from = opt('--from');
  const to = opt('--to');
  const files = args.filter((a) => !a.startsWith('--') && a !== from && a !== to);

  if (from === undefined || to === undefined) {
    console.error('usage: translate.mjs --from <lang> --to <lang> [--write] <files...>');
    process.exit(1);
  }

  const write = args.includes('--write');
  const vocabulary = loadVocabulary();
  for (const f of files) {
    const translated = translate(readFileSync(f, 'utf8'), from, to, vocabulary);
    if (write) {
      writeFileSync(f, translated);
      console.log(`translated ${f}: ${from} -> ${to}`);
    } else {
      process.stdout.write(translated);
    }
  }
}
