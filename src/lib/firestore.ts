import type { Result } from './result';
import { ensureUser, getIdToken, refreshSession } from './db';

/** Firestore over REST — private documents under users/{uid}/… (see firestore.rules). */
const PROJECT_ID = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || '';

const FS_ROOT = (): string => `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
type Fields = Record<string, { stringValue?: string }>;

/** Authenticated Firestore call under users/{uid}/… — refreshes an expired token once, then retries. */
async function fsCall(path: string, init: RequestInit = {}): Promise<Result<Response>> {
  const user = await ensureUser();
  if (!user.ok) return user;
  const send = () =>
    fetch(`${FS_ROOT()}/users/${user.data}/${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getIdToken()}` },
    });
  try {
    let r = await send();
    if (r.status === 401 && (await refreshSession()).ok) r = await send();
    return { ok: true, data: r };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

const toFields = (data: Record<string, unknown>) => ({
  fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, { stringValue: String(v) }])),
});
const fromFields = (fields: Fields = {}): Record<string, string> =>
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.stringValue ?? '']));

/** Create/overwrite a document: users/{uid}/{collection}/{id} */
export async function saveDoc(collection: string, id: string, data: Record<string, unknown>): Promise<Result<string>> {
  const r = await fsCall(`${collection}/${id}`, { method: 'PATCH', body: JSON.stringify(toFields(data)) });
  if (!r.ok) return r;
  return r.data.ok ? { ok: true, data: id } : { ok: false, error: `Save failed (${r.data.status})` };
}

/** List one collection of the signed-in user's documents (each includes its `id`). */
export async function listDocs(collection: string): Promise<Result<Array<Record<string, string>>>> {
  const r = await fsCall(`${collection}?pageSize=100`);
  if (!r.ok) return r;
  if (!r.data.ok) return { ok: false, error: `List failed (${r.data.status})` };
  const d = (await r.data.json()) as { documents?: Array<{ name: string; fields?: Fields }> };
  return {
    ok: true,
    data: (d.documents ?? []).map((x) => ({ id: x.name.split('/').pop() ?? '', ...fromFields(x.fields) })),
  };
}

export async function deleteDoc(collection: string, id: string): Promise<Result<string>> {
  const r = await fsCall(`${collection}/${id}`, { method: 'DELETE' });
  if (!r.ok) return r;
  return r.data.ok ? { ok: true, data: id } : { ok: false, error: `Delete failed (${r.data.status})` };
}
