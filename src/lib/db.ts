import type { Result } from './result';
import type { Profile } from './auth';

/**
 * Firestore + Auth over REST — ~3KB instead of the 120KB Firebase SDK.
 * Config values (apiKey/projectId) are public-by-design; access is enforced by
 * Firestore Security Rules, not by hiding these. Verified pattern for browser use.
 */
const API_KEY = (import.meta.env.VITE_FIREBASE_API_KEY as string) || '';
const PROJECT_ID = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || '';

const ID_TOKEN_KEY = 'pw_fid';
const REFRESH_KEY = 'pw_frt';

export const dbConfigured = (): boolean => API_KEY.length > 10 && PROJECT_ID.length > 4;

function storeTokens(d: { idToken: string; refreshToken: string }): void {
  localStorage.setItem(ID_TOKEN_KEY, d.idToken);
  localStorage.setItem(REFRESH_KEY, d.refreshToken);
}

function friendlyAuthError(msg?: string): string {
  switch (msg) {
    case 'EMAIL_EXISTS':
      return 'That email is already registered — try signing in.';
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
    case 'INVALID_LOGIN_CREDENTIALS':
      return 'Wrong email or password.';
    case 'INVALID_EMAIL':
      return "That email doesn't look right.";
    case 'WEAK_PASSWORD':
      return 'Password should be at least 6 characters.';
    case 'USER_DISABLED':
      return 'This account has been disabled.';
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      return 'Too many attempts — try again in a few minutes.';
    case 'OPERATION_NOT_ALLOWED':
      return 'Email sign-in is not enabled yet on this project.';
    default:
      return msg ?? 'Something went wrong.';
  }
}

/** Create an email/password account and start its session. */
export async function signUpEmail(name: string, email: string, password: string): Promise<Result<Profile>> {
  if (!dbConfigured()) return { ok: false, error: 'Firebase not configured' };
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName: name, returnSecureToken: true }),
    });
    const d = await r.json();
    if (!r.ok) return { ok: false, error: friendlyAuthError(d?.error?.message) };
    storeTokens(d);
    return { ok: true, data: { uid: d.localId as string, name, email } };
  } catch {
    return { ok: false, error: 'Network error during sign-up' };
  }
}

/** Sign in with email + password; the display name comes back with the session. */
export async function signInEmail(email: string, password: string): Promise<Result<Profile>> {
  if (!dbConfigured()) return { ok: false, error: 'Firebase not configured' };
  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );
    const d = await r.json();
    if (!r.ok) return { ok: false, error: friendlyAuthError(d?.error?.message) };
    storeTokens(d);
    const name = (d.displayName as string) || email.split('@')[0];
    return { ok: true, data: { uid: d.localId as string, name, email } };
  } catch {
    return { ok: false, error: 'Network error during sign-in' };
  }
}

/** Exchange the refresh token for a fresh id token — the session survives reloads. */
export async function refreshSession(): Promise<Result<string>> {
  const rt = localStorage.getItem(REFRESH_KEY);
  if (!rt) return { ok: false, error: 'No session' };
  try {
    const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(rt)}`,
    });
    const d = await r.json();
    if (!r.ok) {
      signOut();
      return { ok: false, error: 'Session expired' };
    }
    storeTokens({ idToken: d.id_token, refreshToken: d.refresh_token });
    return { ok: true, data: d.id_token as string };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

export function hasSession(): boolean {
  return !!localStorage.getItem(REFRESH_KEY);
}

export function signOut(): void {
  localStorage.removeItem(ID_TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(ID_TOKEN_KEY);
}

/** Anonymous sign-in via Identity Toolkit — no login UI needed. */
async function signInAnonymously(): Promise<Result<string>> {
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
    storeTokens(d);
    return { ok: true, data: d.localId as string };
  } catch {
    return { ok: false, error: 'Network error during sign-in' };
  }
}

/** Current uid — signs in anonymously on first use. */
export async function ensureUser(): Promise<Result<string>> {
  const cached = localStorage.getItem(ID_TOKEN_KEY);
  if (cached) {
    try {
      const uid = JSON.parse(atob(cached.split('.')[1])).user_id as string;
      return { ok: true, data: uid };
    } catch {
      /* stale token — fall through */
    }
  }
  return signInAnonymously();
}

export const getIdToken = (): string => localStorage.getItem(ID_TOKEN_KEY) ?? '';
