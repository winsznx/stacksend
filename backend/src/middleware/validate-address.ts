import type { Request, Response, NextFunction } from 'express';
import { isValidStacksAddress } from '../utils/security.js';

export function validateAddressParam(req: Request, res: Response, next: NextFunction): void {
  const { address } = req.params;
  if (!address || !isValidStacksAddress(address)) {
    res.status(400).json({ error: 'Invalid Stacks address' });
    return;
  }
  next();
}

export type {};
