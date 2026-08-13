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
  es:
    '2026-08-12: three adversarial LLM passes, 29 corrections applied; ' +
    'a fourth documented-usage pass settled 4 of 8 open questions against ' +
    'cited sources, leaving the 4 that turn on a native ear',
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

  // --- Type names -----------------------------------------------------------
  // The type table added 31 names. Most are derived from a value already in the
  // registry, or are cognates with one real candidate. These seven were genuine
  // choices, recorded here rather than quietly decided.

  {
    language: 'es',
    current: 'Lector',
    alternatives: ['Entorno', 'Ambiente', 'Lectora'],
    sites: [{ module: 'reader', concept: 'Reader' }],
    question:
      '`Reader` is named for what it does — read from an injected environment. ' +
      '`Lector` is the literal agent noun and keeps the metaphor; `Entorno` ' +
      'names the thing it reads instead, which may describe the type better to ' +
      'someone who has not met the pattern. Which is clearer in a signature?',
  },
  {
    language: 'es',
    current: 'TareaResultado',
    alternatives: ['ResultadoDeTarea', 'TareaConResultado'],
    sites: [{ module: 'task', concept: 'TaskResult' }],
    question:
      'A compound for `Task<Result<E, A>>`. Spanish normally puts the head noun ' +
      'first with a linking preposition, so stacking two nouns may read as a ' +
      'calque of English. Is `TareaResultado` acceptable in a type name, or ' +
      'should it be `ResultadoDeTarea`?',
  },
  {
    language: 'es',
    current: 'Cadena',
    alternatives: ['Tuberia', 'Encadenamiento'],
    sites: [{ module: 'pipe', concept: 'Pipe' }],
    question:
      '`Cadena` follows the value `encadenar`, but it is also the ordinary word ' +
      'for "string" — a live ambiguity in a typed library where strings appear ' +
      'constantly. Is that collision tolerable, or does the type need another noun?',
  },
  {
    language: 'es',
    current: 'Espera',
    alternatives: ['Retardo', 'Dormir'],
    sites: [{ module: 'agent', concept: 'Sleep' }],
    question:
      '`Sleep` is an injected delay capability, not the act of sleeping. ' +
      '`Espera` ("a wait") names the effect; `Retardo` ("a delay") names the ' +
      'duration. Which reads better as the type of a parameter?',
  },
  {
    language: 'es',
    current: 'Retroceso',
    alternatives: ['Espaciado', 'Reintento'],
    sites: [{ module: 'agent', concept: 'Backoff' }],
    question:
      'The corresponding value is already `espaciando` ("spacing out"). ' +
      '`Retroceso` is the literal "backing off" but suggests moving backwards ' +
      'rather than waiting longer between attempts. Should the type follow the ' +
      'value to `Espaciado`?',
  },
  {
    language: 'es',
    current: 'ErrorDeHerramienta',
    alternatives: ['FalloDeHerramienta', 'ErrorDeLlamada'],
    sites: [{ module: 'agent', concept: 'ToolError' }],
    question:
      'The registry uses `fallo` for `err` and `Fallo` for the `Err` type, so ' +
      '`Error…` here is inconsistent with that choice — but `error` is also the ' +
      'ordinary word a developer expects. Consistency or familiarity?',
  },
  {
    language: 'es',
    current: 'RelojFijado',
    alternatives: ['ConReloj', 'FasesConReloj'],
    sites: [{ module: 'agent', concept: 'ClockBound' }],
    question:
      'The type of what `conReloj` returns: the retry phrases with a clock ' +
      'already bound in. `RelojFijado` reads as "fixed clock", which describes ' +
      'the clock rather than the bundle of phrases it produces. Is there a ' +
      'better noun?',
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
export const resolvedQuestions: ReadonlyArray<ResolvedQuestion> = [
  {
    language: 'es',
    current: 'converger',
    alternatives: ['convergir'],
    sites: [{ module: 'birds', concept: 'converge' }],
    question:
      'Both infinitives are attested. Which is the safer neutral choice for a ' +
      'library read across regions?',
    resolution: {
      by: 'documented-usage pass (RAE Diccionario panhispánico de dudas)',
      date: '2026-08-12',
      rationale:
        'Kept `converger`. The question assumed a regional split — peninsular ' +
        'vs Latin American — and that premise is unsupported: the DPD records ' +
        'both infinitives as valid and describes the difference as FREQUENCY, ' +
        'not geography, with `converger` the more frequent form and `convergir` ' +
        'valid but less common across the Spanish-speaking world generally. No ' +
        'source consulted documents a Spain/Latin America distribution. Keeping ' +
        'the more frequent form is therefore the neutral choice, and the ' +
        'original reasoning for changing it was mistaken.',
      native: false,
    },
  },
  {
    language: 'es',
    current: 'desdeSincrono',
    alternatives: ['desdeSincronico'],
    sites: [{ module: 'task', concept: 'fromSync' }],
    question: '`sincrono` vs `sincronico` — is one regionally safer for a computing audience?',
    resolution: {
      by: 'documented-usage pass (Spanish-language programming literature)',
      date: '2026-08-12',
      rationale:
        'Kept `desdeSincrono`. In computing specifically, the `sincrono` / ' +
        '`asincrono` pair is the established terminology across regions — ' +
        '"programacion asincrona", "codigo sincrono" — and dominates ' +
        'Spanish-language technical writing regardless of origin. `sincronico` ' +
        'is a valid adjective in general Spanish but is not the term of art ' +
        'here. This is a domain-usage question rather than a regional one.',
      native: false,
    },
  },
  {
    language: 'es',
    current: 'fluir',
    alternatives: ['flujo'],
    sites: [{ module: 'pipe', concept: 'flow' }],
    question:
      '`flow` is a noun in English; `fluir` is a verb and `flujo` the noun. ' +
      'Consistency with the rest of the module, or accuracy to the part of speech?',
    resolution: {
      by: 'internal consistency (not a question about Spanish)',
      date: '2026-08-12',
      rationale:
        'Kept `fluir`. This resolved without needing fluency: the module names ' +
        'its other export `encadenar`, a verb, and both functions are actions ' +
        'that build a composed pipeline. A verb/noun mix within a two-export ' +
        'module reads worse than either choice made consistently. The argument ' +
        'is about this codebase rather than about Spanish, which is why it did ' +
        'not need a native speaker — but see `enlazar`, still open, where the ' +
        'same surface question does.',
      native: false,
    },
  },
  {
    language: 'es',
    current: 'par',
    alternatives: ['parOrdenado', 'dupla'],
    sites: [{ module: 'birds', concept: 'pair' }],
    question:
      '`par` also means "even number". Is that ambiguity real enough at a call ' +
      'site to pay for a longer name?',
    resolution: {
      by: 'documented-usage pass (mathematical terminology)',
      date: '2026-08-12',
      rationale:
        'Kept `par`. `par ordenado` is the standard mathematical term and `par` ' +
        'is its ordinary short form; `dupla` is attested as a synonym but is ' +
        'the rarer of the two. The "even number" sense is a real ambiguity in ' +
        'isolation but is resolved by position at every call site, since `par` ' +
        'here is applied to two values and never to a number. A longer name ' +
        'would buy disambiguation this library does not need.',
      native: false,
    },
  },
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

/**
 * The TYPE vocabulary, kept separate because the two need different emit.
 *
 * A dialect module re-exports values as `export { ok as exito }` and types as
 * `export type { Result as Resultado }`. Merging the two tables would mean
 * carrying a `kind` discriminator on every entry and teaching every gate to
 * branch on it, to save one table.
 *
 * Grounding differs too: a type is not a runtime export, so it is verified
 * against the built `.d.mts` rather than the `.mjs`.
 *
 * ## Why these exist at all
 *
 * Without them a dialect can only express fully-inferred call sites. The moment
 * a program writes `Result<Failure, string>` — which real TypeScript does
 * constantly — it cannot be translated, because no dialect exported the name.
 * That gap made the codemod unable to translate any annotated program, which is
 * most of them.
 *
 * ## Provenance, honestly
 *
 * Some of these are DERIVED from a value name already in the table and inherit
 * its provenance: `RateLimited` is the type behind `rateLimited`, already named
 * `tasaExcedida`, so `TasaExcedida` follows rather than being chosen. Others are
 * cognates with essentially one candidate (`Exponential` → `Exponencial`).
 *
 * The rest are new judgement calls, and the contested ones are recorded in
 * {@link openQuestions} rather than presented as settled. `Flow` → `Flujo` is
 * deliberately entangled with the still-open question about the VALUE `fluir`:
 * if a reviewer moves the value to `flujo`, the pair should be revisited
 * together.
 *
 * Bird interfaces are excluded for the same reason bird values are: proper
 * nouns from a specific book.
 */
export const typeVocabulary: Vocabulary = {
  option: {
    // Derived: the values `some`/`none` are already `algo`/`nada`.
    Option: { en: 'Option', es: 'Opcion' },
    Some: { en: 'Some', es: 'Algo' },
    None: { en: 'None', es: 'Nada' },
  },

  result: {
    Result: { en: 'Result', es: 'Resultado' },
    // Derived from `ok`/`err`, which carry their own open question about
    // `exito` vs `acierto` — resolving that moves this name too.
    Ok: { en: 'Ok', es: 'Exito' },
    Err: { en: 'Err', es: 'Fallo' },
  },

  task: {
    Task: { en: 'Task', es: 'Tarea' },
    TaskResult: { en: 'TaskResult', es: 'TareaResultado' },
  },

  reader: {
    Reader: { en: 'Reader', es: 'Lector' },
  },

  pipe: {
    Pipe: { en: 'Pipe', es: 'Cadena' },
    Flow: { en: 'Flow', es: 'Flujo' },
  },

  agent: {
    Tool: { en: 'Tool', es: 'Herramienta' },
    ToolError: { en: 'ToolError', es: 'ErrorDeHerramienta' },
    Sleep: { en: 'Sleep', es: 'Espera' },
    Backoff: { en: 'Backoff', es: 'Retroceso' },
    RetryPolicy: { en: 'RetryPolicy', es: 'PoliticaDeReintento' },
    RetryClause: { en: 'RetryClause', es: 'ClausulaDeReintento' },
    ClockBound: { en: 'ClockBound', es: 'RelojFijado' },
    Duration: { en: 'Duration', es: 'Duracion' },
    Attempts: { en: 'Attempts', es: 'Intentos' },
    Fixed: { en: 'Fixed', es: 'Fijo' },
    Exponential: { en: 'Exponential', es: 'Exponencial' },
    Immediate: { en: 'Immediate', es: 'Inmediato' },
    // The seven error variants below are DERIVED from their constructors, which
    // are already named in the value table. They are not fresh choices.
    RateLimited: { en: 'RateLimited', es: 'TasaExcedida' },
    InvalidArgs: { en: 'InvalidArgs', es: 'ArgumentosNoValidos' },
    NotFound: { en: 'NotFound', es: 'NoEncontrado' },
    Timeout: { en: 'Timeout', es: 'TiempoAgotado' },
    Unavailable: { en: 'Unavailable', es: 'NoDisponible' },
    Denied: { en: 'Denied', es: 'Denegado' },
    Unknown: { en: 'Unknown', es: 'Desconocido' },
  },
};

/** Every language in the registry. */
export const languages: ReadonlyArray<Language> = ['en', 'es'];

/** Every module the registry covers. */
export const modules: ReadonlyArray<string> = Object.keys(vocabulary);
