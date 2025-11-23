import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller';
import { validate } from '../middleware/validate';
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
  objectIdSchema,
} from '../validators/event.validator';


const router = Router();

/**
 * GET /api/events
 * Query params: ?start=2025-11-18T00:00:00Z&end=2025-11-24T23:59:59Z
 */
router.get(
  '/',
  validate(eventQuerySchema, 'query'),
  getEvents
);

/**
 * GET /api/events/:id
 * Example: /api/events/507f1f77bcf86cd799439011
 */
router.get(
  '/:id',
  validate(objectIdSchema, 'params'),
  getEventById
);

/**
 * POST /api/events
 * Body: { title, startTime, endTime, color, description?, location? }
 */
router.post(
  '/',
  validate(createEventSchema, 'body'),
  createEvent
);

/**
 * PUT /api/events/:id
 * Body: Any combination of event fields (all optional)
 */
router.put(
  '/:id',
  validate(objectIdSchema, 'params'),
  validate(updateEventSchema, 'body'),
  updateEvent
);

/**
 * DELETE /api/events/:id
 * No body required
 */
router.delete(
  '/:id',
  validate(objectIdSchema, 'params'),
  deleteEvent
);

export default router;
