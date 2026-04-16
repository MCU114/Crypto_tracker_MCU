// Centralized cache helper with TTL support

interface CacheEntry<T> {
  value: T | null;
  updatedAt: number; // Date.now()
  expiresAt: number; // updatedAt + ttlMs
}

const cacheStore = new Map<string, CacheEntry<any>>();

export function getCache<T>(key: string): CacheEntry<T> | null {
  return cacheStore.get(key) ?? null;
}

export function setCache<T>(key: string, value: T, ttlMs: number): void {
  const now = Date.now();
  cacheStore.set(key, {
    value,
    updatedAt: now,
    expiresAt: now + ttlMs,
  });
  console.log(`[Cache] Set ${key}, expires in ${ttlMs}ms`);
}

export function clearCache(key: string): void {
  cacheStore.delete(key);
}

export function isExpired(entry: CacheEntry<any>): boolean {
  return Date.now() > entry.expiresAt;
}

export function getCacheAge(entry: CacheEntry<any>): number {
  // Returns age in milliseconds
  return Date.now() - entry.updatedAt;
}
