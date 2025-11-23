import { Document } from 'mongoose';

/**
 * Base Event Interface
 * Represents the core structure of a calendar event
 */
export interface IEvent {
  title: string;
  startTime: Date;
  endTime: Date;
  color: string;
  description?: string;
  location?: string;
}

/**
 * Event Document Interface
 * Extends IEvent with Mongoose Document properties
 * Used for database operations
 */
export interface IEventDocument extends IEvent, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event Creation Payload
 * Used when creating new events (excludes auto-generated fields)
 */
export interface CreateEventDTO {
  title: string;
  startTime: string | Date; // Accept ISO string from frontend
  endTime: string | Date;
  color: string;
  description?: string;
  location?: string;
}

/**
 * Event Update Payload
 * All fields optional for partial updates
 */
export interface UpdateEventDTO {
  title?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  color?: string;
  description?: string;
  location?: string;
}

/**
 * Query Parameters for fetching events
 * Used for date range filtering
 */
export interface EventQueryParams {
  start?: string; // ISO date string
  end?: string;   // ISO date string
}