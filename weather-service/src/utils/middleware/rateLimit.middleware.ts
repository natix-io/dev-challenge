import { Request, Response, NextFunction } from "express";

const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

let callCount = 0;
let windowStart = Date.now();

/**
 * Express middleware to enforce a simple global rate limit.
 *
 * Limits the number of requests handled by the server within a fixed time window.
 * If the limit is exceeded, passes an error to the next middleware with status 429.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * Rate limiting is applied globally (not per user or IP).
 * - `RATE_LIMIT`: Maximum number of requests allowed per window.
 * - `WINDOW_MS`: Duration of the rate limit window in milliseconds.
 */
export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const now = Date.now();
  if (now - windowStart > WINDOW_MS) {
    windowStart = now;
    callCount = 0;
  }
  if (callCount >= RATE_LIMIT) {
    // Use error middleware pattern
    return next({
      status: 429,
      message: "Rate limit exceeded. Please try again later.",
    });
  }
  callCount++;
  next();
};
