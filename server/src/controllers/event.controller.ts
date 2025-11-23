import { Request, Response } from 'express';
import Event from '../models/Event.model';
import { asyncHandler } from '../utils/asyncHandler';
import { CreateEventDTO, UpdateEventDTO, EventQueryParams } from '../types/event.types';


/**
 * @route   GET /api/events
 * @desc    Get all events (with optional date range filtering)
 * @access  Public
 */
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { start, end } = req.query as EventQueryParams;

  let events;

  if (start && end) {
    // Fetch events within date range
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    events = await Event.find({
      // Find events that overlap with the requested range
      // Event overlaps if: event starts before range ends AND event ends after range starts
      startTime: { $lte: endDate },
      endTime: { $gte: startDate },
    }).sort({ startTime: 1 }); // Sort by start time ascending
  } else {
    // Fetch all events if no date range specified
    events = await Event.find().sort({ startTime: 1 });
  }

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID
 * @access  Public
 */
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    res.status(404).json({
      success: false,
      message: 'Event not found',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Public
 */
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const eventData: CreateEventDTO = req.body;

  // Convert string dates to Date objects
  const event = await Event.create({
    ...eventData,
    startTime: new Date(eventData.startTime),
    endTime: new Date(eventData.endTime),
  });

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event,
  });
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update existing event
 * @access  Public
 */
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateEventDTO = req.body;

  // Convert date strings to Date objects if present
  const dataToUpdate = {
    ...updateData,
    ...(updateData.startTime && { startTime: new Date(updateData.startTime) }),
    ...(updateData.endTime && { endTime: new Date(updateData.endTime) }),
  };

  // findByIdAndUpdate options:
  // - new: true -> return updated document
  // - runValidators: true -> run schema validators on update
  const event = await Event.findByIdAndUpdate(
    id,
    dataToUpdate,
    { new: true, runValidators: true }
  );

  if (!event) {
    res.status(404).json({
      success: false,
      message: 'Event not found',
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: event,
  });
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Public
 */
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    res.status(404).json({
      success: false,
      message: 'Event not found',
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
    data: { id },
  });
});

