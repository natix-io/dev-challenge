/**
 * Represents a cache entry with generic data and a timestamp.
 *
 * @template T - The type of the cached data. Defaults to Record<string, any>.
 * @property {T} data - The cached data.
 * @property {number} timestamp - The time (in milliseconds since epoch) when the data was cached.
 */
export type CacheEntry<T = Record<string, any>> = {
  data: T;
  timestamp: number;
};

/**
 * In-memory cache object for storing cache entries.
 *
 * The keys are unique cache identifiers, and the values are CacheEntry objects.
 */
export const cache: Record<string, CacheEntry<any>> = {};

/**
 * Stores the provided data in the cache under the specified key with a timestamp.
 *
 * @param {string} key - The unique identifier for the cache entry.
 * @param {T} data - The data to be cached.
 * @returns {Record<string, CacheEntry<T>>} The updated cache object.
 */
export const storeInCache = <T = Record<string, any>>(
  key: string,
  data: T,
): Record<string, CacheEntry<T>> => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
  return cache;
};
