import { z } from "zod";

export const ApiSourceSchema = z.enum([
  "cache",
  "api",
  "external",
  "stale-cache",
]);

export const ApiMetaSchema = z.object({
  source: ApiSourceSchema,
  cachedAt: z.string().optional(),
  fetchedAt: z.string().optional(),
  warning: z.string().optional(),
});

export type apiSource = z.infer<typeof ApiSourceSchema>;
export type apiMeta = z.infer<typeof ApiMetaSchema>;
