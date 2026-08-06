/**
 * `Option<A>` — a value that may be absent.
 *
 * A discriminated union, not a class. That means it is structurally typed,
 * serialises to plain JSON, and narrows correctly with a bare `switch` on
 * `_tag` even if you never touch a helper in this module.
 *
 * ```ts
 * const o: Option<number> = some(42)
 * if (o._tag === 'Some') o.value // narrowed to number
 * ```
 *
 * ## Why `readonly` and why a `_tag`
 *
 * The tag is a string literal rather than a symbol or a class so the value
 * survives `JSON.stringify` and a structured clone. Everything is `readonly`
 * because these are values, not containers to mutate.
 *
 * ## Data-last, curried
 *
 * Every combinator takes its function first and the `Option` last, so it drops
 * straight into `pipe`:
 *
 * ```ts
 * pipe(some(20), map(inc), filter(isEven), getOrElse(() => 0))
 * ```
 *
 * Note the annotation style: these are `const`s with explicit function-type
 * annotations rather than the named-interface pattern the birds use.
 * `isolatedDeclarations` is satisfied either way; the birds carry named
 * interfaces because those types are part of their documented identity
 * (`Bluebird`, `Cardinal`), whereas these are ordinary functions.
 */

/** The present case. */
export interface Some<A> {
  readonly _tag: 'Some';
  readonly value: A;
}

/** The absent case. Carries no payload. */
export interface None {
  readonly _tag: 'None';
}

/** A value that may be absent. */
export type Option<A> = Some<A> | None;

// --- Constructors ----------------------------------------------------------

/** Wrap a present value. */
export const some: <A>(value: A) => Option<A> = (value) => ({ _tag: 'Some', value });

/**
 * The absent value.
 *
 * A single frozen constant rather than a function: `None` carries no payload,
 * so there is nothing to allocate per use.
 */
export const none: Option<never> = { _tag: 'None' };

// --- Refinements -----------------------------------------------------------

/** Type guard narrowing to {@link Some}. */
export const isSome: <A>(fa: Option<A>) => fa is Some<A> = <A>(fa: Option<A>): fa is Some<A> =>
  fa._tag === 'Some';

/** Type guard narrowing to {@link None}. */
export const isNone: <A>(fa: Option<A>) => fa is None = <A>(fa: Option<A>): fa is None =>
  fa._tag === 'None';

// --- Interop ---------------------------------------------------------------

/**
 * Convert a nullable value. Both `null` and `undefined` become {@link none}.
 *
 * @example
 * ```ts
 * fromNullable(document.getElementById('x')) // Option<HTMLElement>
 * ```
 */
export const fromNullable: <A>(a: A | null | undefined) => Option<NonNullable<A>> = (a) =>
  a === null || a === undefined ? none : some(a as NonNullable<typeof a>);

/**
 * Run a function that may throw, capturing failure as {@link none}.
 *
 * The error itself is discarded — use `Result.fromThrowable` when you need it.
 */
export const fromThrowable: <A>(f: () => A) => Option<A> = (f) => {
  try {
    return some(f());
  } catch {
    return none;
  }
};

/** Keep a value only if it satisfies a predicate. */
export const fromPredicate: <A>(predicate: (a: A) => boolean) => (a: A) => Option<A> =
  (predicate) => (a) =>
    predicate(a) ? some(a) : none;

/** Collapse to `null` when absent. */
export const toNullable: <A>(fa: Option<A>) => A | null = (fa) => (isSome(fa) ? fa.value : null);

/** Collapse to `undefined` when absent. */
export const toUndefined: <A>(fa: Option<A>) => A | undefined = (fa) =>
  isSome(fa) ? fa.value : undefined;

// --- Transformation --------------------------------------------------------

/** Apply a function to the value if present. Functor `map`. */
export const map: <A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B> = (f) => (fa) =>
  isSome(fa) ? some(f(fa.value)) : none;

/** Chain a computation that itself may be absent. Monadic `bind`. */
export const flatMap: <A, B>(f: (a: A) => Option<B>) => (fa: Option<A>) => Option<B> =
  (f) => (fa) =>
    isSome(fa) ? f(fa.value) : none;

/** Apply a wrapped function to a wrapped value. Applicative `ap`. */
export const ap: <A, B>(ff: Option<(a: A) => B>) => (fa: Option<A>) => Option<B> = (ff) => (fa) =>
  isSome(ff) && isSome(fa) ? some(ff.value(fa.value)) : none;

/** Discard the value unless it satisfies a predicate. */
export const filter: <A>(predicate: (a: A) => boolean) => (fa: Option<A>) => Option<A> =
  (predicate) => (fa) =>
    isSome(fa) && predicate(fa.value) ? fa : none;

/** Remove one level of nesting. */
export const flatten: <A>(fa: Option<Option<A>>) => Option<A> = (fa) =>
  isSome(fa) ? fa.value : none;

// --- Elimination -----------------------------------------------------------

/**
 * Exhaustively handle both cases.
 *
 * Takes the absent branch first, matching the declaration order of
 * `Option<A> = Some<A> | None` read as "failure then success" — the same order
 * `Result.match` uses, so the two are visually consistent.
 */
export const match: <A, B>(onNone: () => B, onSome: (a: A) => B) => (fa: Option<A>) => B =
  (onNone, onSome) => (fa) =>
    isSome(fa) ? onSome(fa.value) : onNone();

/**
 * Extract the value, computing a fallback if absent.
 *
 * The fallback is a THUNK so it is not evaluated when the value is present —
 * which matters when producing it is expensive or throws.
 */
export const getOrElse: <A>(onNone: () => A) => (fa: Option<A>) => A = (onNone) => (fa) =>
  isSome(fa) ? fa.value : onNone();

/** Fall back to another `Option` if absent. */
export const orElse: <A>(onNone: () => Option<A>) => (fa: Option<A>) => Option<A> =
  (onNone) => (fa) =>
    isSome(fa) ? fa : onNone();

// --- Traversal -------------------------------------------------------------

/**
 * Turn a list of `Option`s into an `Option` of a list.
 *
 * Absent if ANY element is absent — the standard applicative sequence, and it
 * short-circuits on the first `None`.
 */
export const sequence: <A>(fas: ReadonlyArray<Option<A>>) => Option<ReadonlyArray<A>> = (fas) => {
  const out = [];
  for (const fa of fas) {
    if (isNone(fa)) return none;
    out.push(fa.value);
  }
  return some(out);
};

/** Map each element to an `Option`, then {@link sequence}. */
export const traverse: <A, B>(
  f: (a: A) => Option<B>,
) => (as: ReadonlyArray<A>) => Option<ReadonlyArray<B>> = (f) => (as) => sequence(as.map(f));
