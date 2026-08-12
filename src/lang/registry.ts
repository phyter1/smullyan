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
 * encadenar(algo(20), mapear(incrementar), obtenerOSino(() => 0))
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

/**
 * Judgement calls a native speaker should settle. Recorded rather than silently
 * decided, because reviewers disagreed or the trade-off is genuinely regional.
 *
 * - `exito` / `acierto` for Ok — `exito` loses an accent and skews toward
 *   "achievement"; `acierto`/`fallo` is a cleaner native antonym pair.
 * - `desdeAnulable` — `anulable` means "voidable" in law, though Microsoft's
 *   Spanish docs do use it for nullable.
 * - `converger` / `convergir` — peninsular vs Latin American infinitive.
 * - `desdeSincrono` — `sincrono` (Spain, technical) vs `sincronico` (LatAm).
 * - `preguntar` for Reader's `ask` — arguably `pedir`, since it requests the
 *   environment rather than asking a question.
 * - `enlazar` for flatMap — a calque of "bind"; reads as "hyperlink" to some.
 * - `fluir` for flow — `fluir` is intransitive; `flujo` may read better.
 * - `par` for pair — also means "even number", though "par ordenado" is the
 *   standard mathematical term.
 */
export const openQuestions: ReadonlyArray<string> = [
  'exito vs acierto for Ok',
  'desdeAnulable (anulable = voidable in law)',
  'converger vs convergir (regional)',
  'desdeSincrono vs desdeSincronico (regional)',
  'preguntar vs pedir for Reader.ask',
  'enlazar for flatMap (calque of bind)',
  'fluir vs flujo for flow',
  'par for pair (also "even number")',
];

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
    // `segun` ("depending on") fits the usage — case analysis — better than a
    // literal translation of "match", which in Spanish suggests equality.
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
