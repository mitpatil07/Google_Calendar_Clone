import { z } from 'zod';

const dateStringSchema = z
  .string()
  .datetime({ message: 'Must be a valid ISO 8601 date string' })
  .refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Invalid date format' }
  );

/**
 * Create Event Schema
 * Validates all required fields for new events
 */
export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title must not exceed 100 characters')
      .trim(),
    
    startTime: dateStringSchema,
    
    endTime: dateStringSchema,
    
    color: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color')
      .default('#3b82f6'),
    
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .trim()
      .optional(),
    
    location: z
      .string()
      .max(200, 'Location must not exceed 200 characters')
      .trim()
      .optional(),
  })
  .refine(
    (data) => {
      // Cross-field validation: startTime must be before endTime
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return start < end;
    },
    {
      message: 'Start time must be before end time',
      path: ['endTime'], // Show error on endTime field
    }
  )
  .refine(
    (data) => {
      // Minimum duration: 15 minutes
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const duration = end.getTime() - start.getTime();
      const fifteenMinutes = 15 * 60 * 1000;
      return duration >= fifteenMinutes;
    },
    {
      message: 'Event must be at least 15 minutes long',
      path: ['endTime'],
    }
  );

/**
 * Update Event Schema
 * All fields optional (partial updates supported)
 */
export const updateEventSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(100, 'Title must not exceed 100 characters')
      .trim()
      .optional(),
    
    startTime: dateStringSchema.optional(),
    
    endTime: dateStringSchema.optional(),
    
    color: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color')
      .optional(),
    
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .trim()
      .optional(),
    
    location: z
      .string()
      .max(200, 'Location must not exceed 200 characters')
      .trim()
      .optional(),
  })
  .refine(
    (data) => {
      // Only validate if both times are provided
      if (data.startTime && data.endTime) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        return start < end;
      }
      return true;
    },
    {
      message: 'Start time must be before end time',
      path: ['endTime'],
    }
  );

/**
 * Query Parameters Schema
 * Validates date range for fetching events
 */
export const eventQuerySchema = z.object({
  start: dateStringSchema.optional(),
  end: dateStringSchema.optional(),
}).refine(
  (data) => {
    // If both provided, start must be before end
    if (data.start && data.end) {
      const start = new Date(data.start);
      const end = new Date(data.end);
      return start <= end;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['end'],
  }
);

/**
 * MongoDB ObjectId Validator
 * Ensures valid ID format for route parameters
 */
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID format');