import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}

export const errorHandler = (
  err: Error | MongooseError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err);

  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Array<{ field: string; message: string }> | undefined;

  // Mongoose Validation Error
  if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }
  
  // Mongoose Cast Error (e.g., invalid ObjectId)
  else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  
  // MongoDB Duplicate Key Error
  else if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry detected';
    const duplicateError = err as { keyValue?: Record<string, unknown> };
    if (duplicateError.keyValue) {
      const field = Object.keys(duplicateError.keyValue)[0];
      errors = [{
        field: field || 'unknown',
        message: `${field} already exists`,
      }];
    }
  }
  
  // Generic Error with message
  else if (err.message) {
    message = err.message;
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    message,
  };

  // Include validation errors if present
  if (errors) {
    errorResponse.errors = errors;
  }

  // Include stack trace in development only
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};