/**
 * Event Helper Utilities
 * 
 * Functions for event positioning, overlap calculation,
 * and data transformation
 */

import type { CalendarEvent, PositionedEvent, EventPosition } from '@/types';
import { calculateEventTop, calculateEventHeight, doEventsOverlap } from './dateHelpers';

/**
 * Transform API event (string dates) to CalendarEvent (Date objects)
 */
export const transformApiEvent = (apiEvent: {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  description?: string;
  location?: string;
}): CalendarEvent => {
  return {
    ...apiEvent,
    startTime: new Date(apiEvent.startTime),
    endTime: new Date(apiEvent.endTime),
  };
};

/**
 * Transform multiple API events
 */
export const transformApiEvents = (
  apiEvents: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    color: string;
    description?: string;
    location?: string;
  }>
): CalendarEvent[] => {
  return apiEvents.map(transformApiEvent);
};

/**
 * Calculate overlapping event columns
 * 
 * Algorithm:
 * 1. Sort events by start time
 * 2. Group overlapping events
 * 3. Assign column indices to each event
 * 
 * This ensures overlapping events are displayed side-by-side
 * rather than on top of each other
 */
export const calculateEventColumns = (events: CalendarEvent[]): PositionedEvent[] => {
  if (events.length === 0) return [];
  
  // Sort by start time, then by duration (longer events first)
  const sorted = [...events].sort((a, b) => {
    const startDiff = a.startTime.getTime() - b.startTime.getTime();
    if (startDiff !== 0) return startDiff;
    // If same start time, longer event comes first
    const aDuration = a.endTime.getTime() - a.startTime.getTime();
    const bDuration = b.endTime.getTime() - b.startTime.getTime();
    return bDuration - aDuration;
  });
  
  // Track columns: each column has events that don't overlap
  const columns: CalendarEvent[][] = [];
  const eventColumnMap = new Map<string, number>();
  
  sorted.forEach(event => {
    // Find first column where event doesn't overlap with existing events
    let placed = false;
    
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const column = columns[colIndex];
      const hasOverlap = column?.some(existing =>
        doEventsOverlap(
          event.startTime,
          event.endTime,
          existing.startTime,
          existing.endTime
        )
      );
      
      if (!hasOverlap && column) {
        column.push(event);
        eventColumnMap.set(event.id, colIndex);
        placed = true;
        break;
      }
    }
    
    // If no available column, create new one
    if (!placed) {
      columns.push([event]);
      eventColumnMap.set(event.id, columns.length - 1);
    }
  });
  
  const totalColumns = columns.length;
  
  // Calculate positions for each event
  return sorted.map(event => {
    const columnIndex = eventColumnMap.get(event.id) ?? 0;
    const width = 100 / totalColumns;
    const left = columnIndex * width;
    
    const position: EventPosition = {
      top: `${calculateEventTop(event.startTime)}%`,
      height: `${calculateEventHeight(event.startTime, event.endTime)}%`,
      width: `${width}%`,
      left: `${left}%`,
    };
    
    return {
      ...event,
      position,
      column: columnIndex,
      totalColumns,
    };
  });
};

/**
 * Group events by date
 * Useful for organizing events in the week view
 */
export const groupEventsByDate = (
  events: CalendarEvent[]
): Map<string, CalendarEvent[]> => {
  const grouped = new Map<string, CalendarEvent[]>();
  
  events.forEach(event => {
    const dateKey = event.startTime.toDateString();
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, event]);
  });
  
  return grouped;
};

/**
 * Filter events for a specific day
 */
export const getEventsForDay = (
  events: CalendarEvent[],
  day: Date
): CalendarEvent[] => {
  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(day);
  dayEnd.setHours(23, 59, 59, 999);
  
  return events.filter(event =>
    doEventsOverlap(event.startTime, event.endTime, dayStart, dayEnd)
  );
};

/**
 * Validate event data
 */
export const validateEventData = (data: {
  title: string;
  startTime: Date;
  endTime: Date;
}): { valid: boolean; error?: string } => {
  if (!data.title.trim()) {
    return { valid: false, error: 'Title is required' };
  }
  
  if (data.startTime >= data.endTime) {
    return { valid: false, error: 'End time must be after start time' };
  }
  
  const durationMinutes = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60);
  if (durationMinutes < 15) {
    return { valid: false, error: 'Event must be at least 15 minutes' };
  }
  
  return { valid: true };
};

/**
 * Generate a lighter shade of a color (for event backgrounds)
 */
export const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};