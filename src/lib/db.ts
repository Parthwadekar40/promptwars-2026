import type { Result } from './result';

/**
 * Firestore + Anonymous Auth over REST — ~2KB instead of the 120KB Firebase SDK.
 * Config values (apiKey/projectId) are public-by-design; access is enforced by
 * Firestore Security Rules, not by hiding these. Verified pattern for browser use.
 */
const API_KEY = (import.meta.env.VITE_FIREBASE_API_KEY as string) || '';
const PROJECT_ID = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || '';

const ID_TOKEN_KEY = 'pw_fid';

export const dbConfigured = (): boolean => API_KEY.length > 10 && PROJECT_ID.length > 4;

/** Anonymous sign-in via Identity Toolkit — no login UI needed. */
export async function signInAnonymously(): Promise<Result<string>> {
  if (!dbConfigured()) return { ok: false, error: 'Firebase not configured' };
  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnSecureToken: true }),
      },
    );
    const d = await r.json();
    if (!r.ok) return { ok: false, error: d?.error?.message ?? 'Sign-in failed' };
    sessionStorage.setItem(ID_TOKEN_KEY, d.idToken);
    return { ok: true, data: d.localId as string };
  } catch {
    return { ok: false, error: 'Network error during sign-in' };
  }
}

/** Current uid — signs in anonymously on first use. */
export async function ensureUser(): Promise<Result<string>> {
  const cached = sessionStorage.getItem(ID_TOKEN_KEY);
  if (cached) {
    const uid = JSON.parse(atob(cached.split('.')[1])).user_id as string;
    return { ok: true, data: uid };
  }
  return signInAnonymously();
}

function token(): string {
  return sessionStorage.getItem(ID_TOKEN_KEY) ?? '';
}

/** Create/overwrite a document: users/{uid}/{collection}/{id} */
export async function saveDoc(
  collection: string,
  id: string,
  data: Record<string, unknown>,
): Promise<Result<string>> {
  const user = await ensureUser();
  if (!user.ok) return user;
  try {
    const r = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${user.data}/${collection}/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          fields: Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, { stringValue: String(v) }]),
          ),
        }),
      },
    );
    if (!r.ok) return { ok: false, error: `Save failed (${r.status})` };
    return { ok: true, data: id };
  } catch {
    return { ok: false, error: 'Network error while saving' };
  }
}

/** Read one document back. */
export async function loadDoc<T = Record<string, string>>(
  collection: string,
  id: string,
): Promise<Result<T>> {
  const user = await ensureUser();
  if (!user.ok) return user;
  try {
    const r = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${user.data}/${collection}/${id}`,
      { headers: { Authorization: `Bearer ${token()}` } },
    );
    if (r.status === 404) return { ok: false, error: 'Not found' };
    const d = await r.json();
    if (!r.ok) return { ok: false, error: `Load failed (${r.status})` };
    const fields = Object.fromEntries(
      Object.entries(d.fields ?? {}).map(([k, v]: [string, any]) => [k, v.stringValue]),
    );
    return { ok: true, data: fields as T };
  } catch {
    return { ok: false, error: 'Network error while loading' };
  }
}
