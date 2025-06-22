/**
 * Handles GET requests to /weather?city=<CityName>
 *
 * @param {object} event - The AWS Lambda event object
 * @param {object} event.queryStringParameters - Query parameters from the HTTP request
 * @param {string} event.queryStringParameters.city - Name of the city requested by the user
 *
 * @returns {object} - HTTP response containing weather data for the requested city.
 *                    Includes statusCode, body (stringified JSON), and relevant weather fields.
 */
exports.handler = async (event) => {
    /**
     * Input -
     * event.queryStringParameters.city - Name of the city requested by the user
     */

    // Step-by-step Logic

    /** 
     * 1. Validate Input
     * 
     * If `city` is not provided in the query, return:
     * HTTP 400 Bad Request
     * Body: "City is required"
     */
    const city = extractCityFromQuery(event);
    if (!city) return badRequest("City is required");

    /**
     * 2. Check cached weather data
     * 
     * Construct Cache Key: weather:<cityname>
     * Attempt to fetch data from Redis using the key
     * If cache hit and data is < 1 hour old, return it
     */
    const cacheKey = getCacheKey(city);
    const cached = await getCachedWeather(cacheKey);
    if (cached && isFresh(cached.timestamp)) {
        return successResponse(city, cached.data, false, cached.timestamp);
    }

    /**
     * 3. Check rate limit
     * 
     * Use Redis to count requests within current hour
     */
    const quotaKey = getQuotaKey();
    const underLimit = await checkRateLimit(quotaKey);

    if (underLimit) {
        /**
         * 4. Call external weather API
         * 
         * Fetch fresh weather and cache it
         */
        try {
            const data = await fetchWeatherFromAPI(city);
            await cacheWeather(cacheKey, data);
            return successResponse(city, data, false, Date.now());
        } catch (err) {
            /**
             * 5. Handle API failure
             * 
             * Fallback to stale data or return error
             */
            if (cached) return successResponse(city, cached.data, true, cached.timestamp);
            return serviceUnavailable("External API failed, no cached data");
        }
    } else {
        /**
         * 6. Handle rate limit exceeded
         * 
         * Use stale cache if available; else return 503
         */
        if (cached) return successResponse(city, cached.data, true, cached.timestamp);
        return serviceUnavailable("Rate limit exceeded, no cached data");
    }
}

/**
 * Extracts the city name from the API Gateway event query string.
 *
 * @param {object} event - The AWS Lambda event object.
 * @returns {string|undefined} The trimmed city name, or undefined if missing.
 */
function extractCityFromQuery(event) {
    return event.queryStringParameters?.city?.trim();
}

/**
 * Constructs a Redis key for caching weather data based on the city name.
 *
 * @param {string} city - The name of the city.
 * @returns {string} A Redis-compatible cache key (e.g., "weather:london").
 */
function getCacheKey(city) {
    return `weather:${city.toLowerCase()}`;
}

/**
 * Constructs a Redis key used to track API usage for the current hour.
 *
 * @returns {string} A Redis key formatted as "externalApiUsage:YYYY-MM-DDTHH".
 */
function getQuotaKey() {
    const hour = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
    return `externalApiUsage:${hour}`;
}

/**
 * Retrieves cached weather data from Redis.
 *
 * @param {string} key - The Redis key under which weather data is stored.
 * @returns {Promise<object|null>} Parsed cache object with timestamp and data, or null if not found.
 */
async function getCachedWeather(key) {
    const raw = await redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
}

/**
 * Checks if a given timestamp is within the last 1 hour.
 *
 * @param {number} timestamp - The Unix timestamp (in milliseconds) to validate.
 * @returns {boolean} True if the data is fresh; otherwise, false.
 */
function isFresh(timestamp) {
    return (Date.now() - timestamp) < 3600 * 1000;
}

/**
 * Increments and checks the hourly API usage quota in Redis.
 *
 * @param {string} key - The Redis key for API usage tracking.
 * @returns {Promise<boolean>} True if under quota (<= 100); false if limit exceeded.
 */
async function checkRateLimit(key) {
    const count = await redisClient.incr(key);
    if (count === 1) await redisClient.expire(key, 3600); // Set expiry only on first use
    return count <= 100;
}

/**
 * Calls the external weather API to fetch today's weather for a given city.
 *
 * @param {string} city - The name of the city to query.
 * @returns {Promise<object>} The raw weather data response from the external API.
 */
async function fetchWeatherFromAPI(city) {
    const response = await axios.get(`https://external.api/weather?city=${city}`);
    return response.data;
}

/**
 * Stores weather data in Redis with a 1-hour TTL.
 *
 * @param {string} key - Redis key to store the data under.
 * @param {object} data - Weather data to store.
 * @returns {Promise<void>}
 */
async function cacheWeather(key, data) {
    const record = {
        timestamp: Date.now(),
        data
    };
    await redisClient.set(key, JSON.stringify(record), { EX: 3600 });
}

/**
 * Builds a standardized successful weather API response.
 *
 * @param {string} city - The city name.
 * @param {object} data - Weather data to return.
 * @param {boolean} stale - Whether the data is stale (from cache).
 * @param {number} timestamp - Time the data was last updated (Unix ms).
 * @returns {object} HTTP 200 response object with formatted weather data.
 */
function successResponse(city, data, stale, timestamp) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            city,
            date: new Date().toISOString().split('T')[0],
            units: "metric",
            stale,
            last_updated: new Date(timestamp).toISOString(),
            weather: data.result.map(item => ({
                hour: item.hour,
                temperature: parseInt(item.temperature),
                condition: item.condition
            }))
        })
    };
}

/**
 * Returns a 400 Bad Request error with a custom message.
 *
 * @param {string} message - Error message to return.
 * @returns {object} HTTP 400 response object.
 */
function badRequest(message) {
    ``
    return { statusCode: 400, body: message };
}


/**
 * Returns a 503 Service Unavailable error with a custom message.
 *
 * @param {string} message - Error message to return.
 * @returns {object} HTTP 503 response object.
 */
function serviceUnavailable(message) {
    return { statusCode: 503, body: message };
}
