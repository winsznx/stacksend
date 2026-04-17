import type { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  res.status(status).json(data);
}

export function sendError(res: Response, status: number, message: string): void {
  res.status(status).json({ error: message });
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export type {};
