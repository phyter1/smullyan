import { describe, it, expect } from 'vitest';

import * as A from '../src/agent/error';
import * as P from '../src/agent/phrases';
import * as T from '../src/agent/tool';
import { pipe } from '../src/pipe/pipe';
import * as R from '../src/result/result';

/** A clock that records what it was asked to wait, and never actually waits. */
const fakeClock = (): { clock: T.Sleep; waits: number[] } => {
  const waits: number[] = [];
  const clock: T.Sleep = (ms) => {
    waits.push(ms);
    return Promise.resolve();
  };
  return { clock, waits };
};

const flaky = (
  failTimes: number,
  error: A.ToolError = A.unavailable('503', 503),
): { tool: T.Tool<string>; calls: () => number } => {
  let calls = 0;
  const tool: T.Tool<string> = () => {
    calls += 1;
    return Promise.resolve(calls <= failTimes ? R.err(error) : R.ok('ok'));
  };
  return { tool, calls: () => calls };
};

describe('durations state their own unit', () => {
  it('converts correctly', () => {
    expect(P.inMillis(P.millis(250))).toBe(250);
    expect(P.inMillis(P.seconds(10))).toBe(10_000);
    expect(P.inMillis(P.minutes(2))).toBe(120_000);
  });

  it('is a tagged value, not a bare number', () => {
    // The whole point: a Duration cannot be confused with a count, and a
    // seconds value cannot be silently read as milliseconds.
    expect(P.seconds(1)).toEqual({ _tag: 'Duration', ms: 1000 });
  });
});

describe('attempt budgets settle the off-by-one', () => {
  it('upTo(n).attempts means n calls in total', () => {
    expect(P.upTo(4).attempts).toEqual({ _tag: 'Attempts', total: 4 });
    expect(P.onceOnly).toEqual({ _tag: 'Attempts', total: 1 });
  });

  it('four attempts is one call and three retries', async () => {
    const { clock, waits } = fakeClock();
    const { retrying } = P.withClock(clock);
    const { tool, calls } = flaky(99);
    await pipe(tool, retrying(P.upTo(4).attempts, P.backingOff(P.everyTime(P.millis(10)))))();
    expect(calls()).toBe(4);
    expect(waits).toHaveLength(3);
  });

  it('onceOnly never retries', async () => {
    const { clock } = fakeClock();
    const { retrying } = P.withClock(clock);
    const { tool, calls } = flaky(99);
    await pipe(tool, retrying(P.within(P.onceOnly)))();
    expect(calls()).toBe(1);
  });
});

describe('backoff phrases', () => {
  it('everyTime is constant', () => {
    const b = P.everyTime(P.millis(250));
    expect([0, 1, 2].map((n) => T.delayFor(b, n))).toEqual([250, 250, 250]);
  });

  it('immediately never waits', () => {
    expect(T.delayFor(P.immediately, 3)).toBe(0);
  });

  it('exponentiallyFrom doubles by default', () => {
    const b = P.exponentiallyFrom(P.millis(100));
    expect([0, 1, 2].map((n) => T.delayFor(b, n))).toEqual([100, 200, 400]);
  });

  it('exponentiallyFrom accepts another factor', () => {
    const b = P.exponentiallyFrom(P.millis(10), 3);
    expect([0, 1, 2].map((n) => T.delayFor(b, n))).toEqual([10, 30, 90]);
  });

  it('cappedAt bounds the growth', () => {
    const b = pipe(P.exponentiallyFrom(P.millis(100)), P.cappedAt(P.millis(300)));
    expect([0, 1, 2, 3].map((n) => T.delayFor(b, n))).toEqual([100, 200, 300, 300]);
  });

  it('cappedAt leaves non-growing schedules alone', () => {
    const fixedB = pipe(P.everyTime(P.millis(50)), P.cappedAt(P.millis(10)));
    expect(T.delayFor(fixedB, 5)).toBe(50);
    expect(pipe(P.immediately, P.cappedAt(P.millis(10)))).toEqual(P.immediately);
  });
});

describe('retry clauses are order-independent', () => {
  it('produces the same policy whichever order the clauses arrive', async () => {
    const a = fakeClock();
    const b = fakeClock();
    const forward = P.withClock(a.clock).retrying(
      P.whileTransient,
      P.upTo(3).attempts,
      P.backingOff(P.exponentiallyFrom(P.millis(100))),
    );
    const reversed = P.withClock(b.clock).retrying(
      P.backingOff(P.exponentiallyFrom(P.millis(100))),
      P.upTo(3).attempts,
      P.whileTransient,
    );
    await pipe(flaky(99).tool, forward)();
    await pipe(flaky(99).tool, reversed)();
    expect(a.waits).toEqual(b.waits);
    expect(a.waits).toEqual([100, 200]);
  });

  it('whileFailing narrows what repeats', async () => {
    const { clock } = fakeClock();
    const { retrying } = P.withClock(clock);
    const { tool, calls } = flaky(99, A.unavailable('503'));
    // Only retry rate limits — an Unavailable should stop immediately.
    await pipe(
      tool,
      retrying(
        P.whileFailing((e) => e._tag === 'RateLimited'),
        P.upTo(5).attempts,
      ),
    )();
    expect(calls()).toBe(1);
  });

  it('server advice wins unless explicitly ignored', async () => {
    const withAdvice = fakeClock();
    const ignoring = fakeClock();
    const clauses = [P.upTo(2).attempts, P.backingOff(P.everyTime(P.millis(50)))] as const;

    await pipe(
      flaky(1, A.rateLimited(999)).tool,
      P.withClock(withAdvice.clock).retrying(...clauses),
    )();
    expect(withAdvice.waits).toEqual([999]);

    await pipe(
      flaky(1, A.rateLimited(999)).tool,
      P.withClock(ignoring.clock).retrying(...clauses, P.ignoringServerAdvice),
    )();
    expect(ignoring.waits).toEqual([50]);
  });

  it('defaults are sensible with no clauses at all', async () => {
    const { clock, waits } = fakeClock();
    const { tool, calls } = flaky(99);
    await pipe(tool, P.withClock(clock).retrying())();
    // One attempt, no waiting — a policy that says nothing does nothing.
    expect(calls()).toBe(1);
    expect(waits).toEqual([]);
  });
});

describe('givingUpAfter', () => {
  it('fails with Timeout carrying the duration in millis', async () => {
    const instant: T.Sleep = () => Promise.resolve();
    const never: T.Tool<number> = () => new Promise(() => {});
    const r = await pipe(never, P.withClock(instant).givingUpAfter(P.seconds(3)))();
    expect(r).toEqual(R.err(A.timedOut(3000)));
  });
});

describe('the readable dialect is the terse one', () => {
  it('produces byte-identical behaviour', async () => {
    const terse = fakeClock();
    const prose = fakeClock();

    const terseResult = await T.retry({
      times: 3,
      backoff: T.exponential(100, 2),
      sleep: terse.clock,
      retryOn: A.isRetryable,
    })(flaky(2).tool)();

    const proseResult = await pipe(
      flaky(2).tool,
      P.withClock(prose.clock).retrying(
        P.whileTransient,
        P.upTo(3).attempts,
        P.backingOff(P.exponentiallyFrom(P.millis(100))),
      ),
    )();

    expect(proseResult).toEqual(terseResult);
    expect(prose.waits).toEqual(terse.waits);
  });
});

describe('a whole tool, read aloud', () => {
  it('reads as a sentence and behaves correctly', async () => {
    const { clock, waits } = fakeClock();
    // Two clock-bound sets on purpose. `withClock` binds ONE clock, which is
    // right in production — there is only one real clock — but in a test the
    // retry clock must resolve instantly while the deadline clock must never
    // resolve, or the timeout wins every race.
    const { retrying } = P.withClock(clock);
    const { givingUpAfter } = P.withClock(() => new Promise<void>(() => {}));
    const { tool } = flaky(2, A.rateLimited(200));

    const fetchIssue = pipe(
      tool,
      retrying(
        P.whileTransient,
        P.upTo(4).attempts,
        P.backingOff(pipe(P.exponentiallyFrom(P.millis(100)), P.cappedAt(P.seconds(5)))),
      ),
      givingUpAfter(P.seconds(10)),
      P.fallingBackTo(P.theValue('degraded')),
    );

    expect(await fetchIssue()).toEqual(R.ok('ok'));
    expect(waits.slice(0, 2)).toEqual([200, 200]);
  });

  it('falls back when everything fails', async () => {
    const { clock } = fakeClock();
    const { retrying } = P.withClock(clock);
    const fetchIssue = pipe(
      flaky(99, A.unavailable('down')).tool,
      retrying(P.whileTransient, P.upTo(2).attempts),
      P.fallingBackTo(P.theValue('degraded')),
    );
    expect(await fetchIssue()).toEqual(R.ok('degraded'));
  });

  it('orDefaultingTo ends the failure channel', async () => {
    const r = await pipe(T.fail<string>(A.denied('nope')), P.orDefaultingTo('safe'))();
    expect(r).toEqual(R.ok('safe'));
  });

  it('callingApi lifts and classifies', async () => {
    expect(await P.callingApi(() => Promise.resolve(1))()).toEqual(R.ok(1));
    const classified = await P.callingApi(
      () => Promise.reject(new Error('429')),
      () => A.rateLimited(500),
    )();
    expect(classified).toEqual(R.err(A.rateLimited(500)));
  });
});
