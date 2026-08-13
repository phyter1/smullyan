import type { Deps } from '../examples/weather/weather';

import { describe, it, expect, vi } from 'vitest';

import * as En from '../examples/weather/weather';
import * as Es from '../examples/weather/weather.es';

/**
 * The example program, run in both dialects.
 *
 * This suite is the proof behind the library's most distinctive claim: that a
 * program can be mechanically translated between natural languages and still be
 * the same program. `weather.es.ts` is not written by hand — it is generated
 * from `weather.ts` by the codemod, and `pnpm examples:check` fails if it has
 * drifted. Asserting the two produce IDENTICAL output is what makes that
 * generation trustworthy rather than merely plausible.
 *
 * It also exists because the example found three real defects that 292 tests
 * and four build gates did not: the codemod left namespace members untranslated,
 * crossed module boundaries with a global rename map, and no dialect exported a
 * single type. Nothing had ever compiled generated output before.
 */

const reading = { city: 'Lisbon', tempC: 21.5 };

/** Instant, so the retry schedule is exercised without wall-clock time. */
const noSleep = (): Promise<void> => Promise.resolve();

const depsWith = (fetchJson: Deps['fetchJson'], env: Deps['env'] = {}): Deps => ({
  env: { WEATHER_API: 'https://api.example', UNITS: 'celsius', ...env },
  fetchJson,
  sleep: noSleep,
});

describe('the example program', () => {
  it('renders a reading', async () => {
    const deps = depsWith(() => Promise.resolve(reading));
    await expect(En.report('Lisbon')(deps)()).resolves.toBe('Lisbon: 21.5°C');
  });

  it('converts to fahrenheit when configured', async () => {
    const deps = depsWith(() => Promise.resolve(reading), { UNITS: 'fahrenheit' });
    await expect(En.report('Lisbon')(deps)()).resolves.toBe('Lisbon: 70.7°F');
  });

  it('retries a transient failure and then succeeds', async () => {
    // Two rejections, then a result. A thrown Error classifies as `Unknown`,
    // which is retryable, so the budget of four attempts covers it.
    const fetchJson = vi
      .fn<Deps['fetchJson']>()
      .mockRejectedValueOnce(new Error('flaky'))
      .mockRejectedValueOnce(new Error('flaky'))
      .mockResolvedValue(reading);

    await expect(En.report('Lisbon')(depsWith(fetchJson))()).resolves.toBe('Lisbon: 21.5°C');
    expect(fetchJson).toHaveBeenCalledTimes(3);
  });

  it('gives up once the attempt budget is spent', async () => {
    const fetchJson = vi.fn<Deps['fetchJson']>().mockRejectedValue(new Error('down'));
    await expect(En.report('Lisbon')(depsWith(fetchJson))()).resolves.toContain('did not answer');
    // `times` counts the first attempt, so four means four calls, not five.
    expect(fetchJson).toHaveBeenCalledTimes(4);
  });

  it.each([
    ['no city', undefined, {}, 'No city given'],
    ['a blank city', '   ', {}, 'No city given'],
    ['no endpoint', 'Lisbon', { WEATHER_API: undefined }, 'WEATHER_API is not set'],
    ['bad units', 'Lisbon', { UNITS: 'kelvin' }, 'must be celsius or fahrenheit'],
  ])('reports %s', async (_label, city, env, expected) => {
    const deps = depsWith(() => Promise.resolve(reading), env);
    await expect(En.report(city)(deps)()).resolves.toContain(expected);
  });

  it('reports a payload it cannot read', async () => {
    const deps = depsWith(() => Promise.resolve({ city: 'Lisbon' }));
    await expect(En.report('Lisbon')(deps)()).resolves.toContain('something unexpected');
  });
});

describe('the Spanish twin is the same program', () => {
  // Not "similar" — identical. The dialect is an alias re-export, so any
  // divergence means the codemod changed behaviour rather than names.

  it.each([
    ['a reading', 'Lisbon', {}],
    ['fahrenheit', 'Lisbon', { UNITS: 'fahrenheit' }],
    ['a missing city', undefined, {}],
    ['a missing endpoint', 'Lisbon', { WEATHER_API: undefined }],
    ['bad units', 'Lisbon', { UNITS: 'kelvin' }],
  ])('agrees on %s', async (_label, city, env) => {
    const fetchJson = (): Promise<unknown> => Promise.resolve(reading);
    const en = await En.report(city)(depsWith(fetchJson, env))();
    const es = await Es.report(city)(depsWith(fetchJson, env))();
    expect(es).toBe(en);
  });

  it('agrees on the retry schedule, not just the answer', async () => {
    // The failure path is where a translation could plausibly diverge: if the
    // codemod had mistranslated a retry clause, the answer might still match
    // while the number of attempts did not.
    const attempts = async (run: typeof En.report): Promise<number> => {
      const fetchJson = vi.fn<Deps['fetchJson']>().mockRejectedValue(new Error('down'));
      await run('Lisbon')(depsWith(fetchJson))();
      return fetchJson.mock.calls.length;
    };

    const [en, es] = await Promise.all([attempts(En.report), attempts(Es.report)]);
    expect(es).toBe(en);
    expect(en).toBe(4);
  });
});
