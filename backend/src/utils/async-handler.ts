import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an asynchronous Express route handler to automatically catch errors
 * and forward them to the global error handling middleware via next().
 * 
 * @param fn - The asynchronous route handler function
 * @returns A RequestHandler that safely executes the async function
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export type {};
