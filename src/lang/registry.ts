/**
 * The translation registry — the single source of truth for every dialect.
 *
 * ## What this makes possible
 *
 * This library has no free-form surface: no method chains, no string DSL, no
 * configuration keys. Every program written with it is a fixed vocabulary
 * composed positionally. That means source code can be **mechanically
 * translated between natural languages** and still read as prose on the other
 * side, because the structure carries no language at all — only the identifiers
 * do, and each of them maps 1:1.
 *
 * ```ts
 * // Spanish
 * encadenar(algo(20), mapear(incrementar), obtenerODefecto(() => 0))
 * // English — same program, mechanically derived
 * pipe(some(20), map(increment), getOrElse(() => 0))
 * ```
 *
 * ## Three properties, all enforced at build time
 *
 * Naturalness needs a native speaker. These three do not, and they are what
 * make the codemod trustworthy:
 *
 * - **Total** — every concept has a name in every language.
 * - **Injective** — within a module, no two concepts share a name, so
 *   translation cannot be ambiguous in either direction.
 * - **Reversible** — `translate(a → b → a)` is the identity, asserted as a
 *   property test over real source files.
 *
 * A violation of any of them fails the build rather than a review.
 *
 * ## Scope
 *
 * Only names with natural-language MEANING are translated. Deliberately left
 * universal:
 *
 * - **Bird names** (`bluebird`, `cardinal`) — proper nouns from a specific
 *   book, like "Fourier transform". They are also regionally unstable, so a
 *   translation would be less reliable and less useful than the original.
 * - **Symbols** (`B`, `C`, `K`, `S`) — notation, not words.
 * - **Module paths** (`smullyan/es/option`) — package structure. Translating
 *   the segment too was considered and deferred; it multiplies the exports map
 *   for no gain in how the CODE reads, which is where the value is.
 *
 * @experimental Non-English dialects are machine-generated from this table and
 * have NOT been reviewed by a native speaker. English is the reference dialect.
 * The `reviewedBy` field below records what has actually been checked.
 */

/** Languages this registry knows about. English is the reference. */
export type Language = 'en' | 'es';

/**
 * Which dialects a FLUENT SPEAKER has checked. Machine review does not count.
 *
 * Spanish has been through three independent adversarial LLM reviews — one for
 * naturalness to a working developer, one for regional neutrality and
 * grammatical form, one for semantic precision and false friends — and 29
 * corrections were applied where they converged. That found real errors, but it
 * is not the same thing as a native speaker, because the reviewers share the
 * blind spots of whatever produced the vocabulary. So `es` stays null.
 *
 * A test asserts these values, so this cannot silently start claiming review
 * that did not happen.
 */
export const reviewedBy: Readonly<Record<Language, string | null>> = {
  en: 'reference dialect',
  es: null,
};

/**
 * Machine review, recorded separately so it is never mistaken for the real
 * thing. Bump the date when a new pass runs.
 */
export const machineReviewed: Readonly<Record<Language, string | null>> = {
  en: null,
  es: '2026-08-12: three adversarial LLM passes, 29 corrections applied',
};

/** Where a contested name is actually used: one module, one concept. */
export interface Site {
  readonly module: string;
  readonly concept: string;
}

/**
 * A naming judgement call, pinned to the code it concerns.
 *
 * Structured rather than prose so the same gates that hold the vocabulary
 * honest also hold the questions honest — see {@link openQuestions}.
 */
export interface OpenQuestion {
  /** The dialect in question. Never the reference dialect. */
  readonly language: Language;
  /** The name currently shipped. Asserted to match the vocabulary. */
  readonly current: string;
  /** What a reviewer might choose instead. Never includes `current`. */
  readonly alternatives: ReadonlyArray<string>;
  /** Every place `current` is used. Multi-site names must agree everywhere. */
  readonly sites: ReadonlyArray<Site>;
  /** Why this is contested, in enough detail to answer without context. */
  readonly question: string;
}

/**
 * Judgement calls a native speaker should settle. Recorded rather than silently
 * decided, because reviewers disagreed or the trade-off is genuinely regional.
 *
 * These were free text once. That decayed: the registry shipped a comment
 * arguing for `segun` long after the value became `plegar`, and a docblock
 * example calling `obtenerOSino`, which no dialect exports. Prose beside gated
 * data rots, because nothing makes it fail. So each question now names the
 * sites it concerns and quotes the name in force, and a test asserts both —
 * a rename cannot orphan the debate that produced it.
 *
 * Answering one means editing the vocabulary and moving the entry to
 * {@link resolvedQuestions} with a {@link Resolution} attached. The two move
 * together or the build goes red.
 */
export const openQuestions: ReadonlyArray<OpenQuestion> = [
  {
    language: 'es',
    current: 'exito',
    alternatives: ['acierto'],
    sites: [{ module: 'result', concept: 'ok' }],
    question:
      '`exito` loses its accent as an identifier (`éxito`) and skews toward ' +
      '"achievement" rather than "this computation succeeded". `acierto` pairs ' +
      'with `fallo` as a native antonym; `exito`/`fallo` is a weaker opposition. ' +
      'Which reads better at a call site — `esExito(r)` or `esAcierto(r)`?',
  },
  {
    language: 'es',
    current: 'desdeAnulable',
    alternatives: ['desdeNulo', 'desdeOpcional'],
    sites: [
      { module: 'option', concept: 'fromNullable' },
      { module: 'result', concept: 'fromNullable' },
    ],
    question:
      '`anulable` primarily means "voidable" in a legal sense — a contract that ' +
      "can be annulled. Microsoft's Spanish documentation does use it for " +
      'nullable, which is the strongest argument for keeping it. Is that usage ' +
      'established enough for a working developer, or is it jargon borrowed once?',
  },
  {
    language: 'es',
    current: 'converger',
    alternatives: ['convergir'],
    sites: [{ module: 'birds', concept: 'converge' }],
    question:
      'Both infinitives are attested: `converger` is more peninsular, `convergir` ' +
      'more common in Latin America. The registry needs one. Which is the safer ' +
      'neutral choice for a library read by both?',
  },
  {
    language: 'es',
    current: 'desdeSincrono',
    alternatives: ['desdeSincronico'],
    sites: [{ module: 'task', concept: 'fromSync' }],
    question:
      '`sincrono` is the technical form in Spain; `sincronico` is more usual in ' +
      'Latin America. Same regional split as converge/convergir, and it should ' +
      'probably be resolved the same way for consistency.',
  },
  {
    language: 'es',
    current: 'preguntar',
    alternatives: ['pedir', 'obtenerEntorno'],
    sites: [{ module: 'reader', concept: 'ask' }],
    question:
      "Reader's `ask` requests the environment rather than asking a question. " +
      '`preguntar` is the literal translation and carries the interrogative ' +
      'sense; `pedir` ("to request") may describe the operation more accurately. ' +
      'Does `preguntar()` mislead a reader who does not know the English name?',
  },
  {
    language: 'es',
    current: 'enlazar',
    alternatives: ['encadenarPlano', 'aplanarYMapear'],
    sites: [
      { module: 'option', concept: 'flatMap' },
      { module: 'result', concept: 'flatMap' },
      { module: 'task', concept: 'flatMap' },
      { module: 'reader', concept: 'flatMap' },
    ],
    question:
      '`enlazar` is a calque of the monadic "bind" and names the operation the ' +
      'way Spanish-speaking FP writing tends to. But outside that context it ' +
      'reads as "to hyperlink". Does the FP sense carry for a developer meeting ' +
      'it cold, or does it need a more descriptive name?',
  },
  {
    language: 'es',
    current: 'fluir',
    alternatives: ['flujo'],
    sites: [{ module: 'pipe', concept: 'flow' }],
    question:
      '`fluir` is the intransitive verb "to flow"; `flow` here is a noun — the ' +
      'composed pipeline. `flujo` is the noun. Every other name in this module ' +
      'is a verb (`encadenar`), so the verb form is consistent but arguably ' +
      'describes the wrong thing. Consistency or accuracy?',
  },
  {
    language: 'es',
    current: 'par',
    alternatives: ['parOrdenado', 'dupla'],
    sites: [{ module: 'birds', concept: 'pair' }],
    question:
      '`par` also means "even number", which is a live ambiguity in a numeric ' +
      'library. `par ordenado` is the standard mathematical term but is long for ' +
      'a combinator. Is the ambiguity real enough at a call site to pay for it?',
  },
];

/**
 * Who settled a naming question, when, and why.
 *
 * `native` is a separate field rather than something inferred from `by` for the
 * same reason {@link reviewedBy} and {@link machineReviewed} are separate
 * fields: a machine opinion and a native speaker's are not interchangeable, and
 * a record that blurs them is worse than no record. State it explicitly.
 */
export interface Resolution {
  /** Who decided. A person, or the process that stood in for one. */
  readonly by: string;
  /** ISO `YYYY-MM-DD`. */
  readonly date: string;
  /** Why this name won — the part that is worth keeping. */
  readonly rationale: string;
  /** Whether `by` is a fluent speaker of the dialect. Never assume. */
  readonly native: boolean;
}

/** A question that has been settled: the shape of an open one, plus a verdict. */
export interface ResolvedQuestion extends OpenQuestion {
  readonly resolution: Resolution;
}

/**
 * Questions that have been answered, kept rather than deleted.
 *
 * A resolved question is the only durable record of *why* a name was chosen.
 * The vocabulary shows the verdict; without this, the argument that produced it
 * is gone, and the next reviewer relitigates it from scratch — or worse, quietly
 * reverts a decision that was made carefully.
 *
 * The invariants are the same as for open questions, and deliberately so:
 * `current` is the name that WON and must still match the vocabulary at every
 * site, `alternatives` are the names that lost. Move an entry here without
 * updating the vocabulary and the build goes red, exactly as before.
 *
 * Empty until a native speaker settles something. That emptiness is why the
 * gates are written as pure functions and proved against fixtures: a rule that
 * has never run on real data is not a rule, and this list would otherwise sit
 * vacuously green until the moment it first mattered.
 */
export const resolvedQuestions: ReadonlyArray<ResolvedQuestion> = [];

/** A concept: one function, named once per language. */
export type Entry = Readonly<Record<Language, string>>;

/** Every translatable concept, grouped by the module that exports it. */
export interface Vocabulary {
  readonly [module: string]: Readonly<Record<string, Entry>>;
}

/**
 * The vocabulary.
 *
 * Keyed by module, then by the ENGLISH export name, which doubles as the
 * concept identifier. Adding a language means adding a key to every entry —
 * and the totality gate makes a missed one a build failure.
 */
export const vocabulary: Vocabulary = {
  birds: {
    identity: { en: 'identity', es: 'identidad' },
    constant: { en: 'constant', es: 'constante' },
    compose: { en: 'compose', es: 'componer' },
    compose2: { en: 'compose2', es: 'componer2' },
    compose3: { en: 'compose3', es: 'componer3' },
    flip: { en: 'flip', es: 'invertir' },
    duplicate: { en: 'duplicate', es: 'duplicar' },
    // `ap`, `apply` and `applyTo` are three distinct concepts in this library
    // and must stay distinguishable in every language, or translation becomes
    // ambiguous. Spanish separates them as aplicar / invocar / aplicarSobre.
    ap: { en: 'ap', es: 'aplicativo' },
    apply: { en: 'apply', es: 'aplicar' },
    applyTo: { en: 'applyTo', es: 'pasarA' },
    on: { en: 'on', es: 'sobreAmbos' },
    converge: { en: 'converge', es: 'converger' },
    pair: { en: 'pair', es: 'par' },
    pipe2: { en: 'pipe2', es: 'encadenar2' },
  },

  pipe: {
    pipe: { en: 'pipe', es: 'encadenar' },
    flow: { en: 'flow', es: 'fluir' },
  },

  option: {
    // `algo` / `nada` — "something" / "nothing" — read as ordinary Spanish at a
    // call site in a way `alguno` / `ninguno` do not.
    some: { en: 'some', es: 'algo' },
    none: { en: 'none', es: 'nada' },
    isSome: { en: 'isSome', es: 'esAlgo' },
    isNone: { en: 'isNone', es: 'esNada' },
    fromNullable: { en: 'fromNullable', es: 'desdeAnulable' },
    fromThrowable: { en: 'fromThrowable', es: 'desdeLanzable' },
    fromPredicate: { en: 'fromPredicate', es: 'desdePredicado' },
    toNullable: { en: 'toNullable', es: 'aAnulable' },
    toUndefined: { en: 'toUndefined', es: 'aIndefinido' },
    map: { en: 'map', es: 'mapear' },
    // `enlazar` (to bind) rather than a literal "flat map" — it names the
    // monadic operation as Spanish speakers describe it.
    flatMap: { en: 'flatMap', es: 'enlazar' },
    ap: { en: 'ap', es: 'aplicativo' },
    filter: { en: 'filter', es: 'filtrar' },
    flatten: { en: 'flatten', es: 'aplanar' },
    // `plegar` ("to fold") names the operation by what it does — collapse both
    // branches to one value — rather than translating "match", which in Spanish
    // suggests equality testing.
    match: { en: 'match', es: 'plegar' },
    getOrElse: { en: 'getOrElse', es: 'obtenerODefecto' },
    orElse: { en: 'orElse', es: 'oBien' },
    sequence: { en: 'sequence', es: 'secuenciar' },
    traverse: { en: 'traverse', es: 'atravesar' },
  },

  result: {
    ok: { en: 'ok', es: 'exito' },
    err: { en: 'err', es: 'fallo' },
    isOk: { en: 'isOk', es: 'esExito' },
    isErr: { en: 'isErr', es: 'esFallo' },
    fromThrowable: { en: 'fromThrowable', es: 'desdeLanzable' },
    fromNullable: { en: 'fromNullable', es: 'desdeAnulable' },
    map: { en: 'map', es: 'mapear' },
    mapErr: { en: 'mapErr', es: 'mapearFallo' },
    flatMap: { en: 'flatMap', es: 'enlazar' },
    ap: { en: 'ap', es: 'aplicativo' },
    flatten: { en: 'flatten', es: 'aplanar' },
    match: { en: 'match', es: 'plegar' },
    getOrElse: { en: 'getOrElse', es: 'obtenerODefecto' },
    orElse: { en: 'orElse', es: 'oBien' },
    sequence: { en: 'sequence', es: 'secuenciar' },
    traverse: { en: 'traverse', es: 'atravesar' },
  },

  task: {
    of: { en: 'of', es: 'deValor' },
    fromPromise: { en: 'fromPromise', es: 'desdePromesa' },
    fromSync: { en: 'fromSync', es: 'desdeSincrono' },
    map: { en: 'map', es: 'mapear' },
    flatMap: { en: 'flatMap', es: 'enlazar' },
    ap: { en: 'ap', es: 'aplicativo' },
    tryCatch: { en: 'tryCatch', es: 'intentar' },
    all: { en: 'all', es: 'enParalelo' },
    sequential: { en: 'sequential', es: 'enSecuencia' },
  },

  reader: {
    of: { en: 'of', es: 'deValor' },
    ask: { en: 'ask', es: 'preguntar' },
    asks: { en: 'asks', es: 'preguntarPor' },
    map: { en: 'map', es: 'mapear' },
    flatMap: { en: 'flatMap', es: 'enlazar' },
    ap: { en: 'ap', es: 'aplicativo' },
    flatten: { en: 'flatten', es: 'aplanar' },
    local: { en: 'local', es: 'adaptarEntorno' },
    run: { en: 'run', es: 'ejecutar' },
  },

  // The agent phrases are where a dialect earns its keep: these names exist to
  // be read aloud, so translating them produces genuinely conversational code
  // rather than English structure wearing Spanish labels.
  agent: {
    millis: { en: 'millis', es: 'milisegundos' },
    seconds: { en: 'seconds', es: 'segundos' },
    minutes: { en: 'minutes', es: 'minutos' },
    inMillis: { en: 'inMillis', es: 'enMilisegundos' },
    upTo: { en: 'upTo', es: 'hasta' },
    onceOnly: { en: 'onceOnly', es: 'soloUnaVez' },
    everyTime: { en: 'everyTime', es: 'cadaVez' },
    immediately: { en: 'immediately', es: 'inmediatamente' },
    exponentiallyFrom: { en: 'exponentiallyFrom', es: 'exponencialDesde' },
    cappedAt: { en: 'cappedAt', es: 'limitadoA' },
    whileFailing: { en: 'whileFailing', es: 'mientrasFalle' },
    whileTransient: { en: 'whileTransient', es: 'mientrasSeaTransitorio' },
    backingOff: { en: 'backingOff', es: 'espaciando' },
    ignoringServerAdvice: { en: 'ignoringServerAdvice', es: 'ignorandoAlServidor' },
    within: { en: 'within', es: 'dentroDe' },
    withClock: { en: 'withClock', es: 'conReloj' },
    callingApi: { en: 'callingApi', es: 'llamandoServicio' },
    fallingBackTo: { en: 'fallingBackTo', es: 'recurriendoA' },
    orDefaultingTo: { en: 'orDefaultingTo', es: 'oPorDefecto' },
    theValue: { en: 'theValue', es: 'siempre' },
    explain: { en: 'explain', es: 'explicar' },
    isRetryable: { en: 'isRetryable', es: 'esReintentable' },
    rateLimited: { en: 'rateLimited', es: 'tasaExcedida' },
    invalidArgs: { en: 'invalidArgs', es: 'argumentosNoValidos' },
    notFound: { en: 'notFound', es: 'noEncontrado' },
    timedOut: { en: 'timedOut', es: 'tiempoAgotado' },
    unavailable: { en: 'unavailable', es: 'noDisponible' },
    denied: { en: 'denied', es: 'denegado' },
  },
};

/** Every language in the registry. */
export const languages: ReadonlyArray<Language> = ['en', 'es'];

/** Every module the registry covers. */
export const modules: ReadonlyArray<string> = Object.keys(vocabulary);
