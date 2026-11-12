/**
 * localStorage can be missing or throw (private windows, blocked site data,
 * SSR), so every access is guarded and callers always get a usable value.
 */
export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable or full: preferences just won't persist.
  }
  notifyChange(key);
}

type ChangeListener = (key: string) => void;
const listeners = new Set<ChangeListener>();

/** Hear about every write or removal made through these helpers (used by account sync). */
export function onStoredChange(listener: ChangeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyChange(key: string) {
  for (const listener of listeners) {
    try {
      listener(key);
    } catch {
      // A listener must never break a save.
    }
  }
}

export function removeStored(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable: nothing to remove.
  }
  notifyChange(key);
}
