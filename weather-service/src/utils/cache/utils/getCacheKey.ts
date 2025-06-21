/**
 * Generates a cache key for storing or retrieving weather data.
 *
 * Combines the city name (converted to lowercase) and the date into a single string,
 * separated by an underscore. This ensures consistent and unique cache keys for each
 * city-date combination.
 *
 * @param city - The name of the city.
 * @param date - The date string (e.g., '2024-06-01').
 * @returns A string in the format 'city_date', with the city in lowercase.
 */
export function getCacheKey(city: string, date: string): string {
  return `${city.toLowerCase()}_${date}`;
}
