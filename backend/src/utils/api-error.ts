import { HttpStatus } from './http-status.js';
import type { HttpStatusCode } from './http-status.js';

export class ApiError extends Error {
  public readonly statusCode: HttpStatusCode;

  constructor(statusCode: HttpStatusCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }

  static badRequest(message: string): ApiError {
    return new ApiError(HttpStatus.BAD_REQUEST, message);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(HttpStatus.FORBIDDEN, message);
  }

  static notFound(message = 'Not found'): ApiError {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(HttpStatus.INTERNAL, message);
  }
}

export type {};
