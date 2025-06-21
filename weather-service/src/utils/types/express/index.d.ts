import "express";
import {apiSource} from "../../utils/schema/meta.schema";

/**
 * Module augmentation for Express to extend the `Locals` interface.
 * This allows attaching custom properties to `res.locals` with proper type safety.
 *
 * @module express-serve-static-core
 */

declare module "express-serve-static-core" {
    /**
     * Extends Express's `Locals` interface to include custom properties used in middleware.
     *
     * @property {any} [cachedData] - The data retrieved from cache, if available. 
     * @property {apiSource} [responseSource] - Indicates the source of the response, e.g., "cache" or "api".
     * @property {string} [cacheKey] - The cache key used for storing/retrieving data.
     * @property {any} [dataToCache] - The raw data to be cached after the response is sent. Replace `any` with a specific type for better type safety.
     */
    interface Locals {
        cachedData?: any;
        responseSource?: apiSource;
        cacheKey?: string;
        dataToCache?: any;
    }
}