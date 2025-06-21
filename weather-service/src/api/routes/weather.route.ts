import {Router, Response} from "express";
import {fetchWeatherFromApi} from "../utils/fetchWeatherFromApi";
import {
    WeatherApiFullResponse,
    WeatherApiRequestSchema,
} from "../../schema/api.schema";
import {validateQuery} from "../../utils/middleware/validation.middleware";
import {cacheMiddleware} from "../../utils/middleware/cache.middleware";
import {getCacheKey} from "../../utils/cache/utils/getCacheKey";
import {WeatherApiResponse} from "../../schema/weather-api.schema";
import {responseHandler} from "../../utils/middleware/responseHandler.middleware";
import {sendError} from "../../utils/error/sendError";

const router = Router();

/**
 * Sends a standardized API response mapped to WeatherApiFullResponse.
 *
 * @param res - Express response object
 * @param data - Data to map and send (should contain weather, city, date, provider, fetchedAt)
 */
export const sendResponse = (res: Response, data: WeatherApiResponse) => {
    const response: WeatherApiFullResponse = {
        weather: data.weather,
        city: data.city,
        date: data.date,
        provider: "WeatherAPI",
        fetchedAt: new Date().toISOString(),
    };
    res.json(response);
};


/**
 * GET /weather endpoint.
 *
 * Middleware chain:
 * 1. validateQuery - Validates the incoming query parameters against WeatherApiRequestSchema.
 * 2. cacheMiddleware - Checks for a cached response using a generated cache key based on the current date and city.
 * 3. responseHandler - Formats the outgoing response and attaches metadata.
 * 4. Route handler - Fetches weather data from the API if not cached, handles errors, and sends the response.
 *
 * If cached data is found, the response is sent immediately using res.json().
 * Otherwise, fetches fresh data, handles errors, and sends a standardized response.
 */
router.get(
    "/",
    validateQuery(WeatherApiRequestSchema),
    cacheMiddleware({
        getKey: (req) =>
            getCacheKey(
                new Date().toISOString().slice(0, 10),
                req.query.city as string,
            ),
    }),
    responseHandler,
    /**
     * Route handler for fetching weather data.
     *
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    async (req, res, next) => {
        try {
            // If cached data is available, send it using the response handler
            if (res.locals.cachedData) {
                return res.json();
            }
            const city = req.query.city as string;
            const weatherApiResponse = await fetchWeatherFromApi(city);
            if (weatherApiResponse.error) {
                // Handle API error by sending a standardized error response
                return sendError(next, {
                    status: 400,
                    message: weatherApiResponse.error,
                    details: weatherApiResponse.details,
                });
            }
            // Send the successful API response
            sendResponse(res, weatherApiResponse);
        } catch (error: any) {
            // Pass unexpected errors to the error handler middleware
            next(error);
        }
    }
);

export default router;
