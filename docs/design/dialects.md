# Translating a library

Four properties of the translation table are enforced at build time. A fifth —
whether the names actually read well — cannot be, and this note is mostly about
what follows from that.

For how to _use_ a dialect, see [the guide](/guide/dialects).

## One table, generated outputs

`src/lang/registry.ts` is the single source of truth. Everything under
`src/lang/es/` is generated from it by `pnpm dialects` and must never be edited
by hand — `pnpm dialects:check` fails the build if the output has drifted.

The table is keyed by module, then by the **English** export name, which doubles
as the concept identifier:

```ts
option: {
  some:    { en: 'some',    es: 'algo' },
  flatMap: { en: 'flatMap', es: 'enlazar' },
}
```

Adding a language means adding a key to every entry. The gates below make a
missed one a build failure rather than a silent gap.

## The four gates

| Gate          | Property                                            |
| ------------- | --------------------------------------------------- |
| **Total**     | every concept is named in every language            |
| **Injective** | within a module, no two concepts share a name       |
| **Bijective** | globally, one foreign name ↔ one concept            |
| **Grounded**  | every concept is a real export of the built package |

Three of those are obvious. **Bijectivity is the one worth explaining**, because
per-module injectivity looks sufficient and is not.

The codemod's rename map is **global** — it does not know which module a given
identifier came from when translating back. So if two different English concepts
in two different modules both mapped to one Spanish name, a round trip would
silently resolve to the wrong one. Injectivity within each module would still
hold, and the corruption would be invisible.

Repeating the _same_ pairing across modules is fine and expected: `map → mapear`
in all five modules is one concept with one name, which is exactly what
bijectivity requires.

Grounding takes its inventory from the **built package**, not from the source
the generator reads — runtime exports from the `.mjs`, type exports from the
`.d.mts`. A concept in the registry that no longer exists as an export is a
build failure, not a silent omission.

## Reversibility is a law, not an assumption

On top of the gates, `translate(a → b → a) ≡ identity` is asserted as a
property test over generated programs. Injectivity is what makes it hold; the
property test is what proves it still does.

## What the gates cannot check

None of it says whether `enlazar` is a good name for `flatMap`. That needs a
fluent speaker, and the registry is careful never to imply it has had one.

| Field               | Records                                                   |
| ------------------- | --------------------------------------------------------- |
| `reviewedBy`        | dialects a **fluent human speaker** has read              |
| `machineReviewed`   | automated passes, recorded separately and never conflated |
| `openQuestions`     | naming calls still undecided                              |
| `resolvedQuestions` | naming calls settled, with the reasoning kept             |

`reviewedBy.es` is `null`, and a test asserts it, so the value cannot quietly
start claiming a review that did not happen. Spanish has had four machine
passes — three adversarial reviews that produced 29 corrections, and one
documented-usage pass — all recorded in `machineReviewed`, which is a different
field on purpose. Machine reviewers share the blind spots of whatever produced
the vocabulary, so agreement between them is weaker evidence than it looks.

## Questions are data, not comments

Every open question names the sites it concerns and quotes the name currently in
force:

```ts
{
  language: 'es',
  current: 'enlazar',
  alternatives: ['encadenarPlano', 'aplanarYMapear'],
  sites: [
    { module: 'option', concept: 'flatMap' },
    { module: 'result', concept: 'flatMap' },
    { module: 'task',   concept: 'flatMap' },
    { module: 'reader', concept: 'flatMap' },
  ],
  question: '…enough context to answer without reading the codebase',
}
```

This was free text once, and it rotted exactly as you would expect. The registry
shipped a comment arguing for `segun` long after the value became `plegar`, and
a docblock example calling `obtenerOSino`, which no dialect exports. Every
machine-checkable field had a gate; every human-readable justification beside it
did not, and drifted.

So a test now asserts that each question's sites exist and that its quoted name
matches the vocabulary at **every** one of them. Resolving a name without
retiring its question turns the build red, and vice versa. For multi-site names
the same check doubles as a consistency assertion — `enlazar` must mean
`flatMap` in all four modules or the question is incoherent.

### Answers are kept, not deleted

A resolved question moves to `resolvedQuestions` with a `Resolution` attached:
who decided, when, why, and whether they were a native speaker.

`native` is an explicit field rather than something inferred from the name,
for the same reason `reviewedBy` and `machineReviewed` are separate. The
vocabulary records the verdict; this is the only place the argument survives. A
future reviewer who wonders why a name was chosen finds the reasoning instead of
relitigating it — or worse, quietly reverting a decision that was made
carefully.

### Gating a list that starts empty

`resolvedQuestions` began empty, which would have made every per-entry
assertion vacuously true — green for months, first exercised on the day it
mattered. So the checks are written as a pure `faultsIn` function, proved
against fixtures (one valid, eight malformed), and only then applied to the real
list.

That pattern generalises: **a rule that has never run on real data is not a
rule.** Any list that starts empty needs its gate proved somewhere else first.

## What is still open

Four names remain undecided. Each turns on how the word reads to a working
Spanish-speaking developer, which is precisely what no citation can settle:

| Name            | Translates     | The question                                                  |
| --------------- | -------------- | ------------------------------------------------------------- |
| `exito`         | `Result.ok`    | does `acierto` pair better with `fallo`?                      |
| `desdeAnulable` | `fromNullable` | is `anulable` established for "nullable", or legal jargon?    |
| `preguntar`     | `Reader.ask`   | it requests an environment; is `pedir` more accurate?         |
| `enlazar`       | `flatMap`      | does the FP sense of "bind" carry, or does it read as "link"? |

Four others were settled against cited sources and recorded with
`native: false`. One of them is worth repeating as a caution.

`converger` / `convergir` had been recorded as a peninsular-versus-Latin-American
split, and the intuition going in was to rename it. The RAE's _Diccionario
panhispánico de dudas_ says otherwise: both are valid, the difference is
**frequency rather than geography**, and `converger` is the more common form. The
regional premise had been invented, and it was caught only because a citation
existed to check it against.

For the four still open, no such citation exists — which is the whole argument
for wanting a native speaker rather than a fifth machine pass. If you are one and
would like to settle any of them, the questions are written to be answerable
cold in `src/lang/registry.ts`, and a partial answer is genuinely useful.
