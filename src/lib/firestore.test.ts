import { deleteDoc, listDocs, saveDoc } from './firestore';

const jwt = (uid: string) => `h.${btoa(JSON.stringify({ user_id: uid }))}.s`;
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('Firestore REST — one private space per user', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('pw_fid', jwt('u1'));
    localStorage.setItem('pw_frt', 'refresh-1');
  });
  afterEach(() => vi.restoreAllMocks());

  it('saves under users/{uid}/{collection}/{id} with the bearer token and string fields', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(reply({}));
    expect(await saveDoc('reflections', 'e1', { at: 5, json: '{"a":1}' })).toEqual({ ok: true, data: 'e1' });
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/users/u1/reflections/e1');
    expect(init.method).toBe('PATCH');
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${jwt('u1')}`);
    expect(JSON.parse(String(init.body)).fields).toEqual({ at: { stringValue: '5' }, json: { stringValue: '{"a":1}' } });
  });

  it('lists documents with their ids', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      reply({ documents: [{ name: 'projects/p/databases/(default)/documents/users/u1/reflections/e9', fields: { title: { stringValue: 'Hi' } } }] }),
    );
    expect(await listDocs('reflections')).toEqual({ ok: true, data: [{ id: 'e9', title: 'Hi' }] });
  });

  it('refreshes an expired token once, then retries the same call', async () => {
    const f = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(reply({}, 401)) // expired id token
      .mockResolvedValueOnce(reply({ id_token: jwt('u1'), refresh_token: 'refresh-2' })) // secure-token exchange
      .mockResolvedValueOnce(reply({ documents: [] })); // the retried list
    expect(await listDocs('reflections')).toEqual({ ok: true, data: [] });
    expect(f).toHaveBeenCalledTimes(3);
    expect(String(f.mock.calls[1][0])).toContain('securetoken.googleapis.com');
    expect(localStorage.getItem('pw_frt')).toBe('refresh-2');
  });

  it('reports a failed save or delete instead of throwing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(reply({}, 500));
    expect(await saveDoc('reflections', 'e1', { at: 1 })).toEqual({ ok: false, error: 'Save failed (500)' });
    expect(await deleteDoc('reflections', 'e1')).toEqual({ ok: false, error: 'Delete failed (500)' });
  });

  it('survives a network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('offline'));
    expect(await listDocs('reflections')).toEqual({ ok: false, error: 'Network error' });
  });
});
