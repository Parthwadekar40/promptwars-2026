import { useSyncExternalStore } from 'react';

/** Signed-in profile — persisted so the welcome greeting survives reloads. */
export type Profile = { uid: string; name: string; email: string };

const USER_KEY = 'pw_user';
const listeners = new Set<() => void>();
let cached: Profile | null = load();

function load(): Profile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

function emit(): void {
  listeners.forEach((l) => l());
}

export function getProfile(): Profile | null {
  return cached;
}

export function setProfile(p: Profile): void {
  cached = p;
  localStorage.setItem(USER_KEY, JSON.stringify(p));
  emit();
}

export function clearProfile(): void {
  cached = null;
  localStorage.removeItem(USER_KEY);
  emit();
}

/** Live profile across components (header, hero, CTA). */
export function useProfile(): Profile | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => void listeners.delete(cb);
    },
    () => cached,
  );
}
