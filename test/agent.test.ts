import { test, fc } from '@fast-check/vitest';
import { describe, it, expect } from 'vitest';

import * as A from '../src/agent/error';
import * as T from '../src/agent/tool';
import * as O from '../src/option/option';
import { pipe } from '../src/pipe/pipe';
import * as R from '../src/result/result';

/** A clock that records what it was asked to wait, and never actually waits. */
const fakeClock = (): { sleep: T.Sleep; waits: number[] } => {
  const waits: number[] = [];
  const sleep: T.Sleep = (ms) => {
    waits.push(ms);
    return Promise.resolve();
  };
  return { sleep, waits };
};

/** Extract the error, failing the test rather than branching inside an expect. */
const errorOf = <A>(r: R.Result<A.ToolError, A>): A.ToolError => {
  if (R.isOk(r)) throw new Error('expected an Err, got an Ok');
  return r.error;
};

/** A tool that fails `failTimes` times, then succeeds. Counts its invocations. */
const flaky = (
  failTimes: number,
  error: A.ToolError = A.unavailable('upstream 503', 503),
): { tool: T.Tool<string>; calls: () => number } => {
  let calls = 0;
  const tool: T.Tool<string> = () => {
    calls += 1;
    return Promise.resolve(calls <= failTimes ? R.err(error) : R.ok('ok'));
  };
  return { tool, calls: () => calls };
};

describe('ToolError — the vocabulary', () => {
  it('constructors omit absent optional fields rather than setting undefined', () => {
    // Matters for JSON: `{"limit": undefined}` and a missing key differ once
    // the value crosses a wire and comes back.
    expect(A.rateLimited(100)).toEqual({ _tag: 'RateLimited', retryAfterMs: 100 });
    expect(Object.hasOwn(A.rateLimited(100), 'limit')).toBe(false);
    expect(A.rateLimited(100, 'search')).toEqual({
      _tag: 'RateLimited',
      retryAfterMs: 100,
      limit: 'search',
    });
    expect(Object.hasOwn(A.notFound('x'), 'suggestions')).toBe(false);
    expect(Object.hasOwn(A.unavailable('x'), 'status')).toBe(false);
    expect(Object.hasOwn(A.denied('x'), 'required')).toBe(false);
    expect(Object.hasOwn(A.unknownError('x'), 'cause')).toBe(false);
  });

  it('carries the fields a caller needs to act', () => {
    expect(A.invalidArgs('filters.since', 'ISO date', 42)).toEqual({
      _tag: 'InvalidArgs',
      path: 'filters.since',
      expected: 'ISO date',
      got: 42,
    });
    expect(A.notFound('reeadme.md', ['README.md'])).toEqual({
      _tag: 'NotFound',
      searched: 'reeadme.md',
      suggestions: ['README.md'],
    });
    expect(A.timedOut(5000)).toEqual({ _tag: 'Timeout', afterMs: 5000 });
    expect(A.denied('no write scope', 'repo:write')).toEqual({
      _tag: 'Denied',
      reason: 'no write scope',
      required: 'repo:write',
    });
  });

  it('classifies thrown values conservatively', () => {
    const e = new Error('boom');
    expect(A.fromThrown(e)).toEqual({ _tag: 'Unknown', message: 'boom', cause: e });
    expect(A.fromThrown('a string')).toEqual({ _tag: 'Unknown', message: 'a string' });
    expect(A.fromThrown(42)).toEqual({ _tag: 'Unknown', message: 'non-Error thrown', cause: 42 });
  });

  it('knows what is worth retrying', () => {
    expect(A.isRetryable(A.rateLimited(1))).toBe(true);
    expect(A.isRetryable(A.timedOut(1))).toBe(true);
    expect(A.isRetryable(A.unavailable('x'))).toBe(true);
    expect(A.isRetryable(A.unknownError('x'))).toBe(true);
    // Repeating these produces the identical failure and burns context.
    expect(A.isRetryable(A.invalidArgs('p', 'e', 1))).toBe(false);
    expect(A.isRetryable(A.denied('x'))).toBe(false);
    expect(A.isRetryable(A.notFound('x'))).toBe(false);
  });

  it('surfaces server retry advice only where it exists', () => {
    expect(A.suggestedDelayMs(A.rateLimited(750))).toEqual(O.some(750));
    expect(A.suggestedDelayMs(A.timedOut(1))).toBe(O.none);
    expect(A.suggestedDelayMs(A.denied('x'))).toBe(O.none);
  });

  it('explains each failure in terms of what to do next', () => {
    expect(A.explain(A.rateLimited(500, 'search'))).toContain('Wait 500ms');
    expect(A.explain(A.rateLimited(500))).not.toContain('undefined');
    expect(A.explain(A.invalidArgs('a.b', 'number', 'x'))).toContain('will fail identically');
    expect(A.explain(A.notFound('q'))).toContain('Try a different query');
    expect(A.explain(A.notFound('q', ['a', 'b']))).toContain('Closest matches: a, b');
    expect(A.explain(A.notFound('q', []))).toContain('Try a different query');
    expect(A.explain(A.timedOut(30))).toContain('narrower request');
    expect(A.explain(A.unavailable('cold start'))).toContain('Safe to retry');
    expect(A.explain(A.unavailable('x', 503))).toContain('status 503');
    expect(A.explain(A.denied('nope'))).toContain('Do not retry');
    expect(A.explain(A.denied('nope', 'repo:write'))).toContain('repo:write');
    expect(A.explain(A.unknownError('odd'))).toContain('Retry once');
  });
});

describe('ToolError — round-tripping', () => {
  const all: ReadonlyArray<A.ToolError> = [
    A.rateLimited(100, 'search'),
    A.invalidArgs('a.b', 'number', 'x'),
    A.notFound('q', ['a']),
    A.timedOut(5),
    A.unavailable('why', 500),
    A.denied('nope', 'scope'),
    A.unknownError('odd'),
  ];

  it('survives JSON in both directions', () => {
    for (const e of all) {
      const round: unknown = JSON.parse(JSON.stringify(e));
      const parsed = A.parse(round);
      expect(O.isSome(parsed)).toBe(true);
      expect(O.toNullable(parsed)).toEqual(e);
    }
  });

  it('rejects malformed input rather than casting', () => {
    expect(A.parse(null)).toBe(O.none);
    expect(A.parse('nope')).toBe(O.none);
    expect(A.parse(42)).toBe(O.none);
    expect(A.parse({})).toBe(O.none);
    expect(A.parse({ _tag: 42 })).toBe(O.none);
    expect(A.parse({ _tag: 'NotATag' })).toBe(O.none);
    // Right tag, wrong payload — the dangerous case.
    expect(A.parse({ _tag: 'RateLimited' })).toBe(O.none);
    expect(A.parse({ _tag: 'RateLimited', retryAfterMs: 'soon' })).toBe(O.none);
    expect(A.parse({ _tag: 'InvalidArgs', path: 'a' })).toBe(O.none);
    expect(A.parse({ _tag: 'NotFound' })).toBe(O.none);
    expect(A.parse({ _tag: 'Timeout' })).toBe(O.none);
    expect(A.parse({ _tag: 'Unavailable' })).toBe(O.none);
    expect(A.parse({ _tag: 'Denied' })).toBe(O.none);
    expect(A.parse({ _tag: 'Unknown' })).toBe(O.none);
  });

  it('an Error cause does not survive JSON, which is why cause is unknown', () => {
    const e = A.fromThrown(new Error('boom'));
    const round: unknown = JSON.parse(JSON.stringify(e));
    // The message survives because we lifted it out; the Error object does not.
    expect(O.isSome(A.parse(round))).toBe(true);
    expect((round as { cause?: unknown }).cause).toEqual({});
  });
});

describe('Backoff — schedules are pure data', () => {
  it('immediate never waits', () => {
    expect(T.delayFor(T.immediate, 0)).toBe(0);
    expect(T.delayFor(T.immediate, 9)).toBe(0);
  });

  it('fixed is constant', () => {
    expect(T.delayFor(T.fixed(250), 0)).toBe(250);
    expect(T.delayFor(T.fixed(250), 5)).toBe(250);
  });

  it('exponential grows geometrically and can be capped', () => {
    const b = T.exponential(100);
    expect([0, 1, 2, 3].map((n) => T.delayFor(b, n))).toEqual([100, 200, 400, 800]);
    const capped = T.exponential(100, 2, 500);
    expect([0, 1, 2, 3].map((n) => T.delayFor(capped, n))).toEqual([100, 200, 400, 500]);
    expect(T.delayFor(T.exponential(10, 3), 2)).toBe(90);
  });

  test.prop([fc.integer({ min: 1, max: 1000 }), fc.integer({ min: 0, max: 10 })])(
    'a capped exponential never exceeds its cap',
    (base, n) => {
      expect(T.delayFor(T.exponential(base, 2, 5000), n)).toBeLessThanOrEqual(5000);
    },
  );
});

describe('retry', () => {
  it('returns the first success without waiting', async () => {
    const { sleep, waits } = fakeClock();
    const { tool, calls } = flaky(0);
    const r = await T.retry({
      times: 3,
      backoff: T.fixed(100),
      sleep,
      retryOn: A.isRetryable,
    })(tool)();
    expect(r).toEqual(R.ok('ok'));
    expect(calls()).toBe(1);
    expect(waits).toEqual([]);
  });

  it('retries transient failures and waits on the schedule', async () => {
    const { sleep, waits } = fakeClock();
    const { tool, calls } = flaky(2);
    const r = await T.retry({
      times: 4,
      backoff: T.exponential(100),
      sleep,
      retryOn: A.isRetryable,
    })(tool)();
    expect(r).toEqual(R.ok('ok'));
    expect(calls()).toBe(3);
    // Exact schedule, asserted rather than slept through.
    expect(waits).toEqual([100, 200]);
  });

  it('does not retry a non-retryable failure', async () => {
    const { sleep, waits } = fakeClock();
    const { tool, calls } = flaky(5, A.invalidArgs('p', 'number', 'x'));
    const r = await T.retry({
      times: 5,
      backoff: T.fixed(100),
      sleep,
      retryOn: A.isRetryable,
    })(tool)();
    expect(R.isErr(r)).toBe(true);
    expect(calls()).toBe(1);
    expect(waits).toEqual([]);
  });

  it('gives up after the budget and returns the LAST failure', async () => {
    const { sleep, waits } = fakeClock();
    const { tool, calls } = flaky(99);
    const r = await T.retry({
      times: 3,
      backoff: T.fixed(50),
      sleep,
      retryOn: A.isRetryable,
    })(tool)();
    expect(R.isErr(r)).toBe(true);
    expect(calls()).toBe(3);
    // Two waits for three attempts — no wait after the final failure.
    expect(waits).toEqual([50, 50]);
  });

  it('prefers the server retry-after over the local schedule', async () => {
    const { sleep, waits } = fakeClock();
    const { tool } = flaky(1, A.rateLimited(1234));
    await T.retry({ times: 2, backoff: T.fixed(50), sleep, retryOn: A.isRetryable })(tool)();
    expect(waits).toEqual([1234]);
  });

  it('can be told to ignore the server advice', async () => {
    const { sleep, waits } = fakeClock();
    const { tool } = flaky(1, A.rateLimited(1234));
    await T.retry({
      times: 2,
      backoff: T.fixed(50),
      sleep,
      retryOn: A.isRetryable,
      respectRetryAfter: false,
    })(tool)();
    expect(waits).toEqual([50]);
  });

  it('times: 1 means never retry', async () => {
    const { sleep } = fakeClock();
    const { tool, calls } = flaky(99);
    await T.retry({ times: 1, backoff: T.fixed(1), sleep, retryOn: A.isRetryable })(tool)();
    expect(calls()).toBe(1);
  });

  it('a non-positive budget still makes one attempt', async () => {
    const { sleep } = fakeClock();
    const { tool, calls } = flaky(0);
    const r = await T.retry({ times: 0, backoff: T.immediate, sleep, retryOn: A.isRetryable })(
      tool,
    )();
    expect(r).toEqual(R.ok('ok'));
    expect(calls()).toBe(1);
  });

  it('immediate backoff never touches the clock', async () => {
    const { sleep, waits } = fakeClock();
    const { tool } = flaky(2);
    await T.retry({ times: 5, backoff: T.immediate, sleep, retryOn: A.isRetryable })(tool)();
    expect(waits).toEqual([]);
  });
});

describe('timeout', () => {
  it('passes through a call that settles in time', async () => {
    // A deadline clock that never resolves, so the call always wins the race.
    const neverExpires: T.Sleep = () => new Promise<void>(() => {});
    const r = await T.timeout(50, neverExpires)(T.succeed(1))();
    expect(r).toEqual(R.ok(1));
  });

  it('fails with Timeout when the clock wins', async () => {
    const immediateClock: T.Sleep = () => Promise.resolve();
    const never: T.Tool<number> = () =>
      new Promise(() => {
        /* never settles */
      });
    const r = await T.timeout(30, immediateClock)(never)();
    expect(r).toEqual(R.err(A.timedOut(30)));
  });
});

describe('recovery and construction', () => {
  it('succeed and fail', async () => {
    expect(await T.succeed(7)()).toEqual(R.ok(7));
    expect(await T.fail<number>(A.denied('no'))()).toEqual(R.err(A.denied('no')));
  });

  it('orElse substitutes another call', async () => {
    const recovered = await pipe(
      T.fail<string>(A.unavailable('down')),
      T.orElse(() => T.succeed('fallback')),
    )();
    expect(recovered).toEqual(R.ok('fallback'));
    const untouched = await pipe(
      T.succeed('first'),
      T.orElse(() => T.succeed('fallback')),
    )();
    expect(untouched).toEqual(R.ok('first'));
  });

  it('withDefault ends the failure channel', async () => {
    const r = await pipe(
      T.fail<number>(A.timedOut(5)),
      T.withDefault(() => -1),
    )();
    expect(r).toEqual(R.ok(-1));
    const ok = await pipe(
      T.succeed(1),
      T.withDefault(() => -1),
    )();
    expect(ok).toEqual(R.ok(1));
  });

  it('fromPromise lifts and classifies', async () => {
    expect(await T.fromPromise(() => Promise.resolve(1))()).toEqual(R.ok(1));
    const boom = await T.fromPromise(() => Promise.reject(new Error('x')))();
    expect(R.isErr(boom) && boom.error._tag).toBe('Unknown');
    // A classifier turns a client's failure into something the model can act on.
    const classified = await T.fromPromise(
      () => Promise.reject(new Error('429')),
      (e) => (e instanceof Error && e.message === '429' ? A.rateLimited(1000) : A.fromThrown(e)),
    )();
    expect(classified).toEqual(R.err(A.rateLimited(1000)));
  });

  it('map and flatMap thread through success only', async () => {
    expect(
      await pipe(
        T.succeed(20),
        T.map((n: number) => n + 1),
      )(),
    ).toEqual(R.ok(21));
    expect(
      await pipe(
        T.fail<number>(A.timedOut(1)),
        T.map((n: number) => n + 1),
      )(),
    ).toEqual(R.err(A.timedOut(1)));
    expect(
      await pipe(
        T.succeed(20),
        T.flatMap((n: number) => T.succeed(n * 2)),
      )(),
    ).toEqual(R.ok(40));
    expect(
      await pipe(
        T.fail<number>(A.denied('x')),
        T.flatMap((n: number) => T.succeed(n)),
      )(),
    ).toEqual(R.err(A.denied('x')));
  });
});

describe('composition — the shape a real agent tool takes', () => {
  it('classify, retry, timeout, fall back', async () => {
    const { sleep, waits } = fakeClock();
    const { tool } = flaky(2, A.rateLimited(200));

    // NOTE: retry and timeout need DIFFERENT fake clocks. A clock that resolves
    // instantly is what you want for retry — no real waiting — but it makes a
    // deadline expire immediately, so the timeout would always win the race and
    // every call would look like a timeout. The deadline clock must never
    // resolve, so the tool wins whenever it settles at all.
    const neverExpires: T.Sleep = () => new Promise(() => {});

    const resilient = pipe(
      tool,
      T.retry({ times: 4, backoff: T.exponential(100), sleep, retryOn: A.isRetryable }),
      T.timeout(10_000, neverExpires),
      T.orElse(() => T.succeed('degraded')),
    );

    expect(await resilient()).toEqual(R.ok('ok'));
    // Server advice won over the exponential schedule, both times.
    expect(waits.slice(0, 2)).toEqual([200, 200]);
  });

  it('a permanent failure reaches the model as actionable text', async () => {
    const { sleep } = fakeClock();
    const denied = T.fail<string>(A.denied('token lacks repo:write', 'repo:write'));
    const r = await pipe(
      denied,
      T.retry({ times: 5, backoff: T.fixed(10), sleep, retryOn: A.isRetryable }),
    )();
    const text = A.explain(errorOf(r));
    expect(text).toContain('Do not retry');
    expect(text).toContain('repo:write');
    // And the whole thing is JSON, ready for a tool-result envelope.
    expect(JSON.parse(JSON.stringify(r))).toEqual({
      _tag: 'Err',
      error: { _tag: 'Denied', reason: 'token lacks repo:write', required: 'repo:write' },
    });
  });
});
