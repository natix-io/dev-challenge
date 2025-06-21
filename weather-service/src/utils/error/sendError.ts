import { NextFunction } from "express";

export interface AppErrorOptions {
    status?: number;
    message: string;
    details?: any;
}

/**
 * Passes a standardized error object to the next Express error-handling middleware.
 *
 * @param next - The Express `NextFunction` to pass control to the error handler.
 * @param options - Error options containing status, message, and optional details.
 * @param options.status - Optional HTTP status code (defaults to 500).
 * @param options.message - Error message to send.
 * @param options.details - Optional additional error details.
 *
 * @example
 * sendError(next, { status: 400, message: "Invalid input", details: { field: "city" } });
 */
export const sendError = (
    next: NextFunction,
    { status = 500, message, details }: AppErrorOptions
) => {
    next({ status, message, errors: details });
}