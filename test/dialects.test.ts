import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import * as EsAgent from '../src/lang/es/agent';
import * as Es from '../src/lang/es/option';
import * as EsPipe from '../src/lang/es/pipe';
import {
  type Language,
  languages,
  machineReviewed,
  modules,
  openQuestions,
  type ResolvedQuestion,
  resolvedQuestions,
  reviewedBy,
  typeVocabulary,
  vocabulary,
} from '../src/lang/registry';
import * as O from '../src/option/option';
import { pipe } from '../src/pipe/pipe';

// The codemod is a plain .mjs script so it can run without a build step. It is
// imported here rather than reimplemented, so the tests exercise the real thing.
const { translate, loadVocabulary, renameMap } = await import('../scripts/translate.mjs');

describe('the registry is honest about what has been verified', () => {
  it('records which dialects a native speaker has checked', () => {
    // If this ever silently claims review that did not happen, the whole
    // "experimental" caveat in the docs becomes a lie.
    expect(reviewedBy.en).toBe('reference dialect');
    expect(reviewedBy.es).toBeNull();
  });

  it('does not let machine review masquerade as human review', () => {
    // Spanish has had three adversarial LLM passes. That found real errors and
    // is worth recording — but the reviewers share the blind spots of whatever
    // produced the vocabulary, so it is NOT native review and must not be
    // recorded as such.
    expect(machineReviewed.es).toContain('adversarial');
    expect(reviewedBy.es).toBeNull();
  });
});

/**
 * A question may concern a value or a type, and the two live in separate tables
 * because they need different emit. Grounding must span both, or adding a type
 * question would silently fail the gate that exists to keep questions honest.
 */
const entryAt = (module: string, concept: string): Readonly<Record<string, string>> | undefined =>
  vocabulary[module]?.[concept] ?? typeVocabulary[module]?.[concept];

describe('open questions are grounded, not prose', () => {
  // These questions exist to be handed to a native speaker. Left as free text
  // they rot silently: the registry already shipped a comment arguing for
  // `segun` long after the value became `plegar`, and a docblock example using
  // an identifier no dialect exports. A question that names a concept must be
  // pinned to that concept, or it decays into folklore the same way.

  it('asks about at least one thing', () => {
    // A guard on the guard: every assertion below is vacuously true over an
    // empty list, so the suite would stay green if the data vanished.
    expect(openQuestions.length).toBeGreaterThan(0);
  });

  it('names a module and concept that actually exist', () => {
    const dangling = openQuestions.flatMap((q) =>
      q.sites
        .filter((s) => entryAt(s.module, s.concept) === undefined)
        .map((s) => `${s.module}.${s.concept}`),
    );
    expect(dangling).toEqual([]);
  });

  it('cites at least one site per question', () => {
    // Without this, a question with no sites passes every check below vacuously.
    for (const q of openQuestions) expect(q.sites.length).toBeGreaterThan(0);
  });

  it('quotes the name the registry currently ships, at every site', () => {
    // The load-bearing assertion. Change `exito` to `acierto` without settling
    // the question and this goes red, so a rename cannot quietly orphan the
    // debate that produced it. Across sites it doubles as a consistency check:
    // `enlazar` must mean flatMap in all four modules or the question is moot.
    const stale = openQuestions.flatMap((q) =>
      q.sites
        .filter((s) => entryAt(s.module, s.concept)?.[q.language] !== q.current)
        .map((s) => `${s.module}.${s.concept}: question says ${q.current}`),
    );
    expect(stale).toEqual([]);
  });

  it('offers alternatives that are real choices', () => {
    for (const q of openQuestions) {
      expect(q.alternatives.length).toBeGreaterThan(0);
      // Listing the current name as its own alternative is a non-question.
      expect(q.alternatives).not.toContain(q.current);
    }
  });

  it('only asks about dialects no native speaker has signed off', () => {
    // A reviewed dialect with open questions is a contradiction: either the
    // reviewer settled them or the review is incomplete.
    for (const q of openQuestions) {
      expect(reviewedBy[q.language]).toBeNull();
    }
  });
});

describe('resolved questions keep the reasoning, not just the verdict', () => {
  // `resolvedQuestions` is empty until a native speaker settles something, so
  // asserting over it directly would be vacuously green — a rule that has never
  // run is not a rule. The checks are therefore pure functions, proved to fire
  // against fixtures below and then applied to the real list.

  const faultsIn = (q: ResolvedQuestion): string[] => {
    const faults: string[] = [];
    const { resolution: r } = q;

    // Checked first because every check below indexes the vocabulary BY the
    // language; an unknown one makes those failures misleading rather than wrong.
    if (!languages.includes(q.language)) faults.push(`unknown language ${q.language}`);
    if (q.sites.length === 0) faults.push('cites no site');
    for (const s of q.sites) {
      const entry = entryAt(s.module, s.concept);
      if (entry === undefined) faults.push(`unknown site ${s.module}.${s.concept}`);
      else if (entry[q.language] !== q.current) {
        // The chosen name must be the one actually shipped. A resolution that
        // records a decision the vocabulary never adopted is fiction.
        faults.push(`${s.module}.${s.concept} ships ${entry[q.language]}, not ${q.current}`);
      }
    }
    if (q.alternatives.includes(q.current)) faults.push('lists the winner as a loser');
    if (r.by.trim().length === 0) faults.push('nobody decided it');
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(r.date)) faults.push(`date ${r.date} is not ISO`);
    if (r.rationale.trim().length === 0) faults.push('no rationale — the point of keeping it');

    return faults;
  };

  const valid: ResolvedQuestion = {
    language: 'es',
    current: 'exito',
    alternatives: ['acierto'],
    sites: [{ module: 'result', concept: 'ok' }],
    question: 'Does `exito` or `acierto` pair better with `fallo`?',
    resolution: {
      by: 'Fixture Reviewer',
      date: '2026-08-12',
      rationale: 'Chosen because the fixture says so.',
      native: true,
    },
  };

  it('accepts a well-formed resolution', () => {
    // Without this the negative cases could pass by rejecting everything.
    expect(faultsIn(valid)).toEqual([]);
  });

  it.each([
    ['a site that does not exist', { sites: [{ module: 'result', concept: 'nope' }] }, 'unknown'],
    ['a verdict the vocabulary never adopted', { current: 'acierto' }, 'ships exito'],
    ['no sites at all', { sites: [] }, 'cites no site'],
    ['the winner listed as an alternative', { alternatives: ['exito'] }, 'winner as a loser'],
    ['a language the registry does not know', { language: 'fr' as Language }, 'unknown language'],
  ])('rejects %s', (_label, patch, expected) => {
    // Joined rather than indexed: one malformation can trip several rules, and
    // the test should not depend on which fires first.
    expect(faultsIn({ ...valid, ...patch }).join(' | ')).toContain(expected);
  });

  it.each([
    ['an anonymous decision', { by: '   ' }, 'nobody decided'],
    ['a malformed date', { date: '12/08/2026' }, 'not ISO'],
    ['a missing rationale', { rationale: '' }, 'no rationale'],
  ])('rejects %s', (_label, patch, expected) => {
    expect(
      faultsIn({ ...valid, resolution: { ...valid.resolution, ...patch } }).join(' | '),
    ).toContain(expected);
  });

  it('holds for every resolution actually recorded', () => {
    // The real gate. Empty today; the fixtures above are what make it trustworthy
    // on the day it is not.
    expect(resolvedQuestions.flatMap((q) => faultsIn(q).map((f) => `${q.current}: ${f}`))).toEqual(
      [],
    );
  });

  it('never leaves a question both open and settled', () => {
    // The one rule that cannot be checked per-entry: a concept must not appear
    // in both lists for the same language, or the registry contradicts itself
    // about whether the matter is closed.
    const key = (lang: string, s: { module: string; concept: string }): string =>
      `${lang}:${s.module}.${s.concept}`;
    const open = new Set(openQuestions.flatMap((q) => q.sites.map((s) => key(q.language, s))));
    const both = resolvedQuestions
      .flatMap((q) => q.sites.map((s) => key(q.language, s)))
      .filter((k) => open.has(k));
    expect(both).toEqual([]);
  });
});

describe('the three mechanical properties', () => {
  it('is TOTAL — every concept named in every language', () => {
    const gaps: string[] = [];
    for (const mod of modules) {
      for (const [concept, names] of Object.entries(vocabulary[mod] ?? {})) {
        for (const lang of languages) {
          if (typeof names[lang] !== 'string' || names[lang].length === 0) {
            gaps.push(`${mod}.${concept}:${lang}`);
          }
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('is INJECTIVE — no two concepts share a name within a module', () => {
    const clashes: string[] = [];
    for (const mod of modules) {
      for (const lang of languages) {
        const seen = new Map<string, string>();
        for (const [concept, names] of Object.entries(vocabulary[mod] ?? {})) {
          const name = names[lang];
          const prior = seen.get(name);
          if (prior !== undefined) clashes.push(`${mod}.${lang}: ${prior} & ${concept} -> ${name}`);
          seen.set(name, concept);
        }
      }
    }
    // Ambiguity here would make translation lossy in one direction.
    expect(clashes).toEqual([]);
  });

  it('every English name is a real export of its module', () => {
    // Grounding is enforced against the BUILT package by gen-dialects.mjs; this
    // asserts the option module specifically, as a fast in-suite sanity check.
    for (const concept of Object.keys(vocabulary['option'] ?? {})) {
      expect(Object.hasOwn(O, concept)).toBe(true);
    }
  });
});

describe('a dialect is the same functions, renamed', () => {
  it('Spanish Option is English Option', () => {
    expect(Es.algo).toBe(O.some);
    expect(Es.nada).toBe(O.none);
    expect(Es.mapear).toBe(O.map);
    expect(Es.enlazar).toBe(O.flatMap);
    expect(Es.obtenerODefecto).toBe(O.getOrElse);
  });

  it('behaves identically, because it IS identical', () => {
    const enResult = pipe(
      O.some(20),
      O.map((n: number) => n + 1),
      O.getOrElse(() => 0),
    );
    const esResult = EsPipe.encadenar(
      Es.algo(20),
      Es.mapear((n: number) => n + 1),
      Es.obtenerODefecto(() => 0),
    );
    expect(esResult).toBe(enResult);
    expect(esResult).toBe(21);
  });

  it('reads as Spanish in the agent dialect', () => {
    // The place a dialect earns its keep: these names exist to be read aloud.
    expect(EsAgent.segundos(10)).toEqual({ _tag: 'Duration', ms: 10_000 });
    expect(EsAgent.milisegundos(250)).toEqual({ _tag: 'Duration', ms: 250 });
    expect(EsAgent.hasta(4).attempts).toEqual({ _tag: 'Attempts', total: 4 });
  });
});

describe('the codemod translates only what it should', () => {
  const sample = `import { some, map, filter, getOrElse } from 'smullyan/option';
import { pipe } from 'smullyan/pipe';

const isEven = (n: number): boolean => n % 2 === 0;
const doubled = [1, 2, 3].map((n) => n * 2);
const config = { map: 'not ours', filter: true };

export const result = pipe(
  some(20),
  map((n: number) => n + 1),
  filter(isEven),
  getOrElse(() => 0),
);
`;

  it('rewrites imported identifiers and module specifiers', () => {
    const es = translate(sample, 'en', 'es');
    expect(es).toContain("from 'smullyan/es/option'");
    expect(es).toContain("from 'smullyan/es/pipe'");
    expect(es).toContain('encadenar(');
    expect(es).toContain('algo(20)');
    expect(es).toContain('obtenerODefecto(');
  });

  it('leaves an unrelated Array#map alone', () => {
    // The dangerous case. A blanket rename would corrupt this.
    const es = translate(sample, 'en', 'es');
    expect(es).toContain('[1, 2, 3].map((n) => n * 2)');
    expect(es).not.toContain('[1, 2, 3].mapear');
  });

  it('leaves object keys alone', () => {
    const es = translate(sample, 'en', 'es');
    expect(es).toContain("map: 'not ours'");
    expect(es).toContain('filter: true');
  });

  it('leaves files that import nothing from smullyan untouched', () => {
    const unrelated = `const map = (x: number) => x;\nexport const y = map(1);\n`;
    expect(translate(unrelated, 'en', 'es')).toBe(unrelated);
  });

  it('preserves a local alias, translating only the imported name', () => {
    const aliased = `import { map as transform } from 'smullyan/option';\nexport const f = transform;\n`;
    const es = translate(aliased, 'en', 'es');
    expect(es).toContain('mapear as transform');
    expect(es).toContain('export const f = transform;');
  });

  it('renames members reached through a namespace import', () => {
    // This test used to assert that `O.some(1)` was left ALONE while the
    // specifier moved — which emits `O.some` against a module exporting `algo`.
    // The assertion pinned broken output as correct, which is why nothing
    // caught it until an example program was compiled.
    const ns = `import * as O from 'smullyan/option';\nexport const x = O.some(1);\n`;
    const es = translate(ns, 'en', 'es');
    expect(es).toContain("import * as O from 'smullyan/es/option'");
    expect(es).toContain('O.algo(1)');
    expect(es).not.toContain('O.some');
  });

  it('translates type names, not just values', () => {
    // Without these a dialect can only express fully-inferred call sites, which
    // excludes most real TypeScript.
    const typed = `import type { Result } from 'smullyan/result';\nexport type R = Result<string, number>;\n`;
    const es = translate(typed, 'en', 'es');
    expect(es).toContain("from 'smullyan/es/result'");
    expect(es).toContain('Resultado');
  });

  it('refuses to emit an import of something that does not exist', () => {
    // `retry` has no Spanish name. Moving the specifier to `smullyan/es/agent`
    // while leaving `retry` behind would produce a file that cannot compile, so
    // the codemod fails loudly instead.
    const untranslatable = `import { retry } from 'smullyan/agent';\nexport const r = retry;\n`;
    expect(() => translate(untranslatable, 'en', 'es')).toThrow(/no es name for/u);
  });

  it('leaves an already-translated file alone', () => {
    // `smullyan/es/option` read with from: 'en' is not an English import.
    const already = `import { algo } from 'smullyan/es/option';\nexport const x = algo;\n`;
    expect(translate(already, 'en', 'es')).toBe(already);
  });
});

describe('reversibility is a law, not an assumption', () => {
  const vocab = loadVocabulary();

  test.prop([
    fc.uniqueArray(fc.constantFrom(...Object.keys(vocabulary['option'] ?? {})), {
      minLength: 1,
      maxLength: 6,
    }),
  ])('translate(en → es → en) is the identity for any Option program', (concepts) => {
    const source = `import { ${concepts.join(', ')} } from 'smullyan/option';\n${concepts
      .map((c, i) => `export const use${String(i)} = ${c};`)
      .join('\n')}\n`;
    const there = translate(source, 'en', 'es');
    const back = translate(there, 'es', 'en');
    expect(back).toBe(source);
  });

  test.prop([
    fc.uniqueArray(fc.constantFrom(...Object.keys(vocabulary['agent'] ?? {})), {
      minLength: 1,
      maxLength: 6,
    }),
  ])('translate(en → es → en) is the identity for any agent program', (concepts) => {
    const source = `import { ${concepts.join(', ')} } from 'smullyan/agent';\n${concepts
      .map((c, i) => `export const use${String(i)} = ${c};`)
      .join('\n')}\n`;
    expect(translate(translate(source, 'en', 'es'), 'es', 'en')).toBe(source);
  });

  it('the rename maps are exact inverses', () => {
    for (const from of languages) {
      for (const to of languages) {
        const there = renameMap(vocab, from, to);
        const back = renameMap(vocab, to, from);
        for (const [a, b] of there) {
          // Injectivity is what makes this hold; without it a name would map
          // back to a different concept than it came from.
          expect(back.get(b)).toBe(a);
        }
      }
    }
  });
});
