import type { Response } from 'express';

/**
 * Sends a successful JSON response with the provided data and status code.
 * 
 * @param res - The Express response object
 * @param data - The data payload to send
 * @param status - The HTTP status code (defaults to 200)
 */
export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  res.status(status).json(data);
}

/**
 * Sends an error JSON response with a specific status code and message.
 * 
 * @param res - The Express response object
 * @param status - The HTTP error status code
 * @param message - The error message to send
 */
export function sendError(res: Response, status: number, message: string): void {
  res.status(status).json({ error: message });
}

/**
 * Sends a 201 Created JSON response with the provided data.
 * 
 * @param res - The Express response object
 * @param data - The data payload to send
 */
export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export type {};
