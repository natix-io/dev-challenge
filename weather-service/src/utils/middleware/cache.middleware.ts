import { Request, Response, NextFunction } from "express";
import { serveFromCache } from "../cache/utils/serveFromCache";
import { storeInCache } from "../cache/utils/storeInCache";

type CacheMiddlewareOptions = {
  getKey: (req: Request) => string;
};

/**
 * Express middleware for caching API responses.
 *
 * This middleware checks if a cached response exists for the current request using a generated cache key.
 * - If cached data is found, it attaches the data to `res.locals.cachedData` and sets the response source to "cache".
 * - If no cached data is found, it sets up a listener to store the response data in the cache after the response is sent.
 *
 * @param {CacheMiddlewareOptions} options - Configuration options for the middleware.
 * @param {(req: Request) => string} options.getKey - Function to generate a cache key based on the request.
 * @returns Express middleware function.
 */
export const cacheMiddleware = (options: CacheMiddlewareOptions) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // Generate and store the cache key for this request
  res.locals.cacheKey = options.getKey(req);

  // Attempt to retrieve cached data using the cache key
  const cached = serveFromCache(res.locals.cacheKey);

  if (cached?.data) {
    // If cached data is found, set response source and attach data to res.locals
    res.locals.responseSource = "cache";
    res.locals.cachedData = cached.data;
    return next();
  }

  // If no cached data, set up a listener to store data in cache after response is sent
  res.on("finish", () => {
    if (
        res.locals.cacheKey &&
        res.locals.responseSource !== "cache" &&
        res.locals.dataToCache
    ) {
      storeInCache(res.locals.cacheKey, res.locals.dataToCache);
    }
  });

  // Proceed to the next middleware or route handler
  next();
};