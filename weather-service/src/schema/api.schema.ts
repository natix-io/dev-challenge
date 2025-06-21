import { z } from "zod";
import { WeatherHourSchema } from "./weather-api.schema";

export const WeatherApiFullResponseSchema = z.object({
  weather: z.array(WeatherHourSchema),
  city: z.string().optional(),
  date: z.string().optional(),
  provider: z.string(),
  fetchedAt: z.string(),
});

export const WeatherApiRequestSchema = z.object({
  city: z.string().min(1),
});

export type WeatherApiFullResponse = z.infer<
  typeof WeatherApiFullResponseSchema
>;
