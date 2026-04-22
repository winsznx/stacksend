import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Express middleware that assigns a unique request ID to each incoming request.
 * It uses the 'x-request-id' header if provided by the client, otherwise generates a new UUID.
 * The request ID is then attached to the response headers for traceability.
 * 
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  res.setHeader('x-request-id', id);
  next();
}

export type {};
