export function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Prototype persistence should never break the ordering UI.
  }
}

export function removeStorage(key: string) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Prototype persistence should never break the ordering UI.
  }
}
