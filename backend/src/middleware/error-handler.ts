import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  logger.error('Unhandled error', { error: message });
  res.status(500).json({ error: 'Internal server error' });
}

export type {};
