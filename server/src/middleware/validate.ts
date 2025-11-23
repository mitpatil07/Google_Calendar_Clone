import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (
  schema: z.ZodSchema,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the specified part of the request
      const validated = schema.parse(req[target]);
      
      // Replace request data with validated/sanitized data
      // This ensures type safety throughout the application
      req[target] = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into user-friendly response
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      // Unexpected error during validation
      res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};
