import { Request, Response, NextFunction } from "express";

/**
 * Express error-handling middleware.
 *
 * Formats and sends a standardized JSON error response.
 *
 * @param {any} err - The error object, expected to have at least a `status` and `message` property.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
  const status = err.status;
  res.status(status).json({
    success: false,
    error: {
      message: err.message,
      details: err.errors || err.stack || undefined,
    },
  });
};