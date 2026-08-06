import type { Result } from '../result/result';

import { err, ok } from '../result/result';

/**
 * `Task<A>` — an asynchronous computation that has not started yet.
 *
 * ```ts
 * type Task<A> = () => Promise<A>
 * ```
 *
 * ## Why a thunk, and not just a Promise
 *
 * A `Promise` is EAGER: it begins executing the moment it is constructed, and
 * it caches its result. That makes promises values-in-flight rather than
 * descriptions of work, with three consequences a `Task` avoids:
 *
 * - **You cannot retry a Promise.** It has already run; awaiting again returns
 *   the same settled value. A `Task` can be invoked as many times as you like.
 * - **You cannot delay a Promise.** Constructing it starts it. Building a
 *   pipeline out of promises therefore starts every step immediately.
 * - **Composition is not referentially transparent.** Substituting a promise
 *   for the expression that produced it changes when the work happens.
 *
 * Wrapping in a thunk restores all three. `Task<A>` is a *description* of
 * asynchronous work; nothing happens until you call it.
 *
 * ## `Task` never fails
 *
 * A `Task<A>` models an async computation that SUCCEEDS with `A`. If it can
 * fail, say so in the type: use {@link TaskResult}, which is
 * `Task<Result<E, A>>`. That keeps the failure channel explicit and typed
 * rather than hidden in a rejected promise that no signature mentions.
 */
export type Task<A> = () => Promise<A>;

/** An asynchronous computation that may fail with `E`. */
export type TaskResult<E, A> = Task<Result<E, A>>;

// --- Constructors ----------------------------------------------------------

/** Lift a plain value into a `Task`. */
export const of: <A>(a: A) => Task<A> = (a) => () => Promise.resolve(a);

/**
 * Wrap an existing promise.
 *
 * Note the argument is a THUNK, not a promise. Taking a promise directly would
 * defeat the purpose: it would already be running.
 */
export const fromPromise: <A>(f: () => Promise<A>) => Task<A> = (f) => f;

/** Lift a synchronous function into a `Task`. */
export const fromSync: <A>(f: () => A) => Task<A> = (f) => () => Promise.resolve(f());

// --- Transformation --------------------------------------------------------

/** Apply a function to the eventual value. */
export const map: <A, B>(f: (a: A) => B) => (fa: Task<A>) => Task<B> = (f) => (fa) => async () =>
  f(await fa());

/** Chain an asynchronous computation. */
export const flatMap: <A, B>(f: (a: A) => Task<B>) => (fa: Task<A>) => Task<B> =
  (f) => (fa) => async () =>
    f(await fa())();

/**
 * Run two tasks CONCURRENTLY and apply the first's function to the second's
 * value.
 *
 * Contrast {@link flatMap}, which is necessarily sequential because the second
 * task depends on the first's result. `ap` has no such dependency, so running
 * in sequence would waste the parallelism for nothing.
 */
export const ap: <A, B>(ff: Task<(a: A) => B>) => (fa: Task<A>) => Task<B> =
  (ff) => (fa) => async () => {
    const [f, a] = await Promise.all([ff(), fa()]);
    return f(a);
  };

// --- Running ---------------------------------------------------------------

/**
 * Run a task, capturing rejection as {@link Err}.
 *
 * This is the boundary between the promise world, where failure is untyped and
 * implicit, and the `Result` world, where it is neither. As with
 * `Result.fromThrowable`, you supply the mapper because a rejection value is
 * genuinely `unknown`.
 */
export const tryCatch: <E, A>(fa: Task<A>, onReject: (e: unknown) => E) => TaskResult<E, A> =
  (fa, onReject) => async () => {
    try {
      return ok(await fa());
    } catch (e) {
      return err(onReject(e));
    }
  };

/** Run tasks CONCURRENTLY, collecting every result. */
export const all: <A>(tasks: ReadonlyArray<Task<A>>) => Task<ReadonlyArray<A>> = (tasks) => () =>
  Promise.all(tasks.map((t) => t()));

/** Run tasks in SEQUENCE, each starting only after the previous settles. */
export const sequential: <A>(tasks: ReadonlyArray<Task<A>>) => Task<ReadonlyArray<A>> =
  (tasks) => async () => {
    const out = [];
    for (const t of tasks) {
      // Awaiting in a loop IS the semantics here. The rule's suggested fix,
      // Promise.all, is the OTHER function in this module — see `all`. Running
      // these concurrently would make `sequential` a synonym for `all`.
      // oxlint-disable-next-line eslint/no-await-in-loop
      out.push(await t());
    }
    return out;
  };

/*
 * NOTE: there is deliberately no `delay`.
 *
 * Delaying requires `setTimeout`, which is a HOST API — it is defined by
 * WHATWG and Node, not by ECMAScript. Using it would mean widening `lib` or
 * adding `@types/node`, and the published .d.ts would then carry an ambient
 * dependency. `types: []` in tsconfig.json exists precisely to guarantee it
 * does not, and tsdown builds with `platform: 'neutral'` on the same premise.
 *
 * A one-line delay is trivial in consumer code, where the host is known:
 *
 *   const delay = (ms: number) => <A>(fa: Task<A>): Task<A> => async () => {
 *     await new Promise((r) => setTimeout(r, ms))
 *     return fa()
 *   }
 */
