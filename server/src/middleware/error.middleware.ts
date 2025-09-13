import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

/**
 * Handles Zod validation errors by sending a 400 response.
 */
const handleZodError = (err: ZodError, res: Response) => {
  const errors = err.errors.map((error) => ({
    path: error.path.join('.'),
    message: error.message,
  }));
  return res.status(400).json({
    status: 'error',
    message: 'Invalid input data',
    errors,
  });
};

/**
 * Handles custom operational errors (AppError) by sending the specified status code and message.
 */
const handleAppError = (err: AppError, res: Response) => {
  return res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
  });
};

/**
 * Handles all other unexpected errors by sending a generic 500 Internal Server Error response.
 * It logs the error for debugging purposes and avoids leaking stack traces in production.
 */
const handleServerError = (err: Error, res: Response) => {

  const response = {
    status: 'error',
    message: 'Internal Server Error. Please try again later.',
    // Only include the stack trace in development for security reasons
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };
  
  return res.status(500).json(response);
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // This 'next' is required for Express to recognize it as an error-handling middleware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction 
) => {
  if (err instanceof ZodError) {
    return handleZodError(err, res);
  }

  if (err instanceof AppError) {
    return handleAppError(err, res);
  }

  // For any other unexpected error, send a generic 500 response
  return handleServerError(err, res);
};