import {
  WeatherApiResponseSchema,
  WeatherApiResponse,
} from "../../schema/weather-api.schema";

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomWeatherForDay = (city: string) => {
  const CONDITIONS = ["Clear", "Cloudy", "Rain", "Sunny", "Storm", "Snow", "Fog"];
  // Optionally, seed randomness by city for consistency
  const baseTemp = getRandomInt(10, 30);
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    temperature: `${baseTemp + getRandomInt(-5, 5)}°C`,
    condition: CONDITIONS[getRandomInt(0, CONDITIONS.length - 1)],
  }));
};

export const fetchWeatherFromApi = async (
  city: string,
): Promise<WeatherApiResponse> => {
  try {
    if (Math.random() < 0.2) {
      throw { message: "External API failure" };
    }
    const validation = WeatherApiResponseSchema.safeParse({
      city,
      date: new Date().toISOString().split("T")[0],
      weather: generateRandomWeatherForDay(city),
      source: "mock-weather-api",
    });
    if (!validation.success) {
      throw { message: "External API failure", stack: validation.error };
    }
    return validation.data;
  } catch (err: any) {
    return {
      city,
      date: new Date().toISOString().split("T")[0],
      weather: [],
      source: "mock-weather-api",
      error: err.message || "Unknown error",
      details: err.stack || err,
    };
  }
};
