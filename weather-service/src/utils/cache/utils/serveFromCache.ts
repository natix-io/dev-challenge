import { cache, CacheEntry } from "./storeInCache";

const CONFIG = require("../config.json");

/**
 * Retrieves a cached entry for the specified key if it exists and is still valid.
 *
 * @param {string} key - The unique identifier for the cache entry to retrieve.
 * @returns {CacheEntry<T> | undefined} The cached entry if valid, otherwise undefined.
 */
export const serveFromCache = <T = Record<string, any>>(
  key: string,
): CacheEntry<T> | undefined => {
  const cached = cache[key] as CacheEntry<T> | undefined;
  if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_TTL) {
    return cached;
  }
};
