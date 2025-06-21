import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import {sendError} from "../error/sendError";

/**
 * Express middleware to validate request query parameters using a Zod schema.
 *
 * Parses and validates `req.query` against the provided Zod schema.
 * If validation fails, passes an error to the next middleware with status 400 and details.
 * If validation succeeds, replaces `req.query` with the parsed data and calls `next()`.
 *
 * @param schema - The Zod schema to validate the query parameters against.
 * @returns An Express middleware function.
 */
export const validateQuery = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
      if (!result.success) {
          return sendError(next, {
              status: 400,
              message: "Invalid request query",
              details: `${result.error.issues[0].path[0]} is ${result.error.issues[0].message}`,
          });
      }
    req.query = result.data;
    next();
  };
};
