/**
 * Safe localStorage wrapper with corruption fallback and error handling.
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[Storage] Failed to read or parse key "${key}". Falling back to default.`, err);
      // Clean corrupted entry
      this.remove(key);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[Storage] Failed to write key "${key}". Storage might be full.`, err);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`[Storage] Failed to remove key "${key}".`, err);
      return false;
    }
  },

  clear(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.clear();
      return true;
    } catch (err) {
      console.error('[Storage] Failed to clear storage.', err);
      return false;
    }
  },
};
