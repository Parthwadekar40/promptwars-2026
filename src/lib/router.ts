import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

/** Minimal hash router — zero dependencies. */
export const useRoute = (): string => useSyncExternalStore(subscribe, () => window.location.hash.slice(1) || '/');

export const navigate = (to: string): void => {
  window.location.hash = to;
};
