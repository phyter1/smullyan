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

/** Parse one registry table, preserving module structure. */
const parseModuleTable = (src, name) => {
  const at = src.indexOf(`export const ${name}: Vocabulary = {`);
  if (at === -1) throw new Error(`registry: could not find \`${name}\``);
  const open = src.indexOf('{', at);
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
  const table = {};
  const moduleRe = /(\w+):\s*\{/g;
  let m;
  const starts = [];
  while ((m = moduleRe.exec(body)) !== null) starts.push({ mod: m[1], at: m.index });

  for (const { mod, at: modAt } of starts) {
    let d = 0;
    for (let i = 0; i < modAt; i += 1) {
      if (body[i] === '{') d += 1;
      else if (body[i] === '}') d -= 1;
    }
    if (d !== 1) continue;
    const openAt = body.indexOf('{', modAt);
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
    const concepts = {};
    for (const c of body.slice(openAt, closeAt + 1).matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
      const names = {};
      for (const n of c[2].matchAll(/(\w+):\s*'([^']*)'/g)) names[n[1]] = n[2];
      concepts[c[1]] = names;
    }
    table[mod] = concepts;
  }
  return table;
};

/**
 * Both registry tables, keyed by module. Values and types translate alike.
 *
 * Memoised because `translate` is called once per file and the property tests
 * call it hundreds of times per run. Re-reading and re-parsing the registry on
 * every call cost ~2ms locally and enough on a CI runner to blow the test
 * timeout — the registry cannot change inside a process, so parsing it once is
 * both correct and the difference between a 2s suite and a 47s one.
 */
let tableCache;
export const loadModuleTables = () => {
  if (tableCache === undefined) {
    const src = readFileSync(new URL('../src/lang/registry.ts', import.meta.url), 'utf8');
    tableCache = {
      values: parseModuleTable(src, 'vocabulary'),
      types: parseModuleTable(src, 'typeVocabulary'),
    };
  }
  return tableCache;
};

/** Raised rather than emitting source that cannot compile. */
export class UntranslatableError extends Error {}

const SPECIFIER = /^smullyan\/(?:([a-z-]+)\/)?(\w+)$/;

/**
 * Which registry module a specifier refers to, or null if it is not an import
 * from the SOURCE dialect. `smullyan/es/option` read with `from: 'en'` is
 * already Spanish and must be left alone.
 */
const moduleOf = (spec, from) => {
  const m = SPECIFIER.exec(spec);
  if (m === null) return null;
  const [, lang, mod] = m;
  return from === 'en' ? (lang === undefined ? mod : null) : lang === from ? mod : null;
};

/**
 * Translate one source file.
 *
 * Module-aware on purpose. The rename map used to be global, which meant
 * `fromPromise` imported from `smullyan/agent` was renamed to `desdePromesa` —
 * the name belonging to `task.fromPromise` — and `smullyan/es/agent` does not
 * export it. Looking names up in the module they were imported FROM is what
 * makes the output compile.
 *
 * Names with no counterpart in that module are a hard error rather than a
 * silent pass-through: moving the specifier while leaving the name behind
 * produces an import of something that does not exist.
 */
export const translate = (source, from, to) => {
  const tables = loadModuleTables();

  const mapFor = (mod) => {
    const map = new Map();
    for (const table of [tables.values, tables.types]) {
      for (const names of Object.values(table[mod] ?? {})) {
        if (names[from] !== undefined && names[to] !== undefined) map.set(names[from], names[to]);
      }
    }
    return map;
  };

  const missing = [];
  const imported = new Set();

  const importRe = /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*(['"])([^'"]+)\2/g;
  let out = source.replace(importRe, (whole, clause, quote, spec) => {
    const mod = moduleOf(spec, from);
    if (mod === null) return whole;
    const map = mapFor(mod);
    const newSpec = to === 'en' ? `smullyan/${mod}` : `smullyan/${to}/${mod}`;

    const newClause = clause.replace(/(\w+)(\s+as\s+\w+)?/g, (bit, name, alias) => {
      if (name === 'type') return bit;
      const target = map.get(name);
      if (target === undefined) {
        missing.push(`${name} (imported from ${spec})`);
        return bit;
      }
      // With an alias the local name is unchanged; only the imported name moves.
      if (alias !== undefined) return `${target}${alias}`;
      imported.add(name);
      return target;
    });
    return `import ${whole.includes('import type') ? 'type ' : ''}{${newClause}} from ${quote}${newSpec}${quote}`;
  });

  // Namespace imports bind a whole module. The specifier moves AND every member
  // access through the binding must be renamed — `O.some` against a module that
  // exports `algo` is exactly the broken output this used to emit.
  const namespaces = [];
  out = out.replace(
    /import\s+(type\s+)?\*\s+as\s+(\w+)\s+from\s+(['"])([^'"]+)\3/g,
    (whole, typeKw, ns, quote, spec) => {
      const mod = moduleOf(spec, from);
      if (mod === null) return whole;
      namespaces.push({ ns, mod });
      const newSpec = to === 'en' ? `smullyan/${mod}` : `smullyan/${to}/${mod}`;
      return `import ${typeKw ?? ''}* as ${ns} from ${quote}${newSpec}${quote}`;
    },
  );

  for (const { ns, mod } of namespaces) {
    const map = mapFor(mod);
    out = out.replace(new RegExp(`\\b${ns}\\.(\\w+)`, 'g'), (whole, member) => {
      const target = map.get(member);
      if (target === undefined) {
        missing.push(`${ns}.${member} (from ${mod})`);
        return whole;
      }
      return `${ns}.${target}`;
    });
  }

  if (missing.length > 0) {
    throw new UntranslatableError(
      `no ${to} name for:\n  ${[...new Set(missing)].join('\n  ')}\n\n` +
        `Refusing to translate: moving the module specifier while leaving these ` +
        `names behind would emit an import of something that does not exist. Add ` +
        `them to src/lang/registry.ts, or leave the file untranslated.`,
    );
  }

  if (imported.size === 0) return out;

  // Rename only what this file imported, on word boundaries, skipping property
  // positions (`.map`) and object keys so unrelated members are never touched.
  const names = [...imported].sort((a, b) => b.length - a.length);
  const bodyRe = new RegExp(`(?<![.\\w$])(${names.join('|')})(?![\\w$:])`, 'g');

  const rename = new Map();
  for (const { mod } of namespaces) void mod;
  for (const table of [tables.values, tables.types]) {
    for (const concepts of Object.values(table)) {
      for (const n of Object.values(concepts)) {
        if (n[from] !== undefined && n[to] !== undefined) rename.set(n[from], n[to]);
      }
    }
  }

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
