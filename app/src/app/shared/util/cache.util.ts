export type CacheEntry<T> = { data: T; ts: number };
export const CACHE_TTL_MS = 5 * 60_000;

export function isCacheEntryFresh<T>(
  entry: CacheEntry<T> | undefined,
): entry is CacheEntry<T> {
  return !!entry && Date.now() - entry.ts <= CACHE_TTL_MS;
}
