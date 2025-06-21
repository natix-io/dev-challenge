import { z } from "zod";

// WeatherHour schema
export const WeatherHourSchema = z.object({
  hour: z.number().int().min(0).max(23),
  temperature: z.string(),
  condition: z.string(),
});

// WeatherApiResponse schema (for a day's weather by hour)
export const WeatherApiResponseSchema = z.object({
  city: z.string(),
  date: z.string(),
  weather: z.array(WeatherHourSchema),
  source: z.string(),
  error: z.string().optional(),
  details: z.any().optional(),
});

export type WeatherApiResponse = z.infer<typeof WeatherApiResponseSchema>;
