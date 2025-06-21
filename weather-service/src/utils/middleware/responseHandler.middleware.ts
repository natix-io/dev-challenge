import { Request, Response, NextFunction } from "express";
import { apiSource, apiMeta } from "../schema/meta.schema";

/**
 * Creates a metadata object for API responses.
 *
 * @param {apiSource} source - The source of the response (e.g., "cache" or "api").
 * @returns {apiMeta} Metadata including the source and the timestamp when the data was fetched.
 */
const createMeta = (source: apiSource): apiMeta => ({
  source,
  fetchedAt: new Date().toISOString(),
});

/**
 * Express middleware to standardize API JSON responses.
 *
 * This middleware wraps the `res.json` method to:
 * - Attach a `success` flag.
 * - Include the response data (from cache if available, otherwise from the handler).
 * - Add a `meta` object with response source and fetch timestamp.
 * - Store data to cache if it was not served from cache.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const responseHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const oldJson = res.json.bind(res);
  res.json = (data: any): Response => {
    const source = res.locals.cachedData ? "cache" : res.locals.responseSource || "api";
    const responseData = res.locals.cachedData || data;
    if (!res.locals.cachedData) res.locals.dataToCache = data;
    return oldJson({
      success: true,
      data: responseData,
      meta: createMeta(source),
    });
  };
  next();
};