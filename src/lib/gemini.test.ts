import { firstSuccess, MODELS } from './gemini';
import type { Attempt } from './gemini';

const ok = (data: string): Attempt => async () => ({ ok: true, data });
const fail = (error: string): Attempt => async () => ({ ok: false, error });

describe('model failover', () => {
  it('lets a faster hedged attempt win and aborts the slow one', async () => {
    let slowAborted = false;
    const slow: Attempt = (signal) =>
      new Promise((resolve) =>
        signal.addEventListener('abort', () => {
          slowAborted = true;
          resolve({ ok: false, error: 'Cancelled' });
        }),
      );
    const r = await firstSuccess([slow, ok('fast')], 15);
    expect(r).toEqual({ ok: true, data: 'fast' });
    expect(slowAborted).toBe(true);
  });

  it('fails over immediately when an attempt errors', async () => {
    const t0 = Date.now();
    const r = await firstSuccess([fail('429 quota'), ok('second model')], 5_000);
    expect(r).toEqual({ ok: true, data: 'second model' });
    expect(Date.now() - t0).toBeLessThan(1_000); // did not wait for the hedge timer
  });

  it('reports the last error when every model fails', async () => {
    const r = await firstSuccess([fail('429'), fail('503')], 10);
    expect(r).toEqual({ ok: false, error: '503' });
  });

  it('keeps a wide chain of independent quota buckets', () => {
    expect(new Set(MODELS).size).toBe(MODELS.length);
    expect(MODELS.length).toBeGreaterThanOrEqual(5);
  });
});
