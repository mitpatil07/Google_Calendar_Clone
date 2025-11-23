/**
 * Date Helper Utilities
 * 
 * Centralized date manipulation functions using date-fns
 * 
 * Why date-fns?
 * - Tree-shakeable (only import what you use)
 * - Immutable (functions return new Date objects)
 * - TypeScript support out of the box
 * - Smaller bundle than moment.js
 */

import {
    startOfWeek,
    endOfWeek,
    addWeeks,
    subWeeks,
    addDays,
    format,
    isSameDay,
    isToday,
    getHours,
    getMinutes,
    setHours,
    setMinutes,
    parseISO,
    startOfDay,
    differenceInMinutes,
  } from 'date-fns';
  import { DAYS_IN_WEEK, GRID_START_HOUR, GRID_HOURS } from '@/constants/calendar.constants';
  import type { WeekDay, CalendarEvent } from '@/types';
  
  /**
   * Get the start of the week (Monday)
   * Google Calendar uses Monday as first day of week
   */
  export const getWeekStart = (date: Date): Date => {
    return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
  };
  
  /**
   * Get the end of the week (Sunday)
   */
  export const getWeekEnd = (date: Date): Date => {
    return endOfWeek(date, { weekStartsOn: 1 });
  };
  
  /**
   * Navigate to next week
   */
  export const getNextWeek = (date: Date): Date => {
    return addWeeks(date, 1);
  };
  
  /**
   * Navigate to previous week
   */
  export const getPrevWeek = (date: Date): Date => {
    return subWeeks(date, 1);
  };
  
  /**
   * Generate array of days for the week
   */
  export const getWeekDays = (weekStart: Date, events: CalendarEvent[]): WeekDay[] => {
    const days: WeekDay[] = [];
    
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      const date = addDays(weekStart, i);
      
      // Filter events for this day
      const dayEvents = events.filter(event => 
        isSameDay(event.startTime, date)
      );
      
      days.push({
        date,
        dayName: format(date, 'EEE'),     // "Mon", "Tue", etc.
        dayNumber: parseInt(format(date, 'd')), // 1-31
        isToday: isToday(date),
        events: dayEvents,
      });
    }
    
    return days;
  };
  
  /**
   * Format date for header display
   * Example: "November 2025"
   */
  export const formatMonthYear = (date: Date): string => {
    return format(date, 'MMMM yyyy');
  };
  
  /**
   * Format date range for header
   * Example: "Nov 18 - 24, 2025"
   */
  export const formatWeekRange = (weekStart: Date): string => {
    const weekEnd = getWeekEnd(weekStart);
    const startMonth = format(weekStart, 'MMM');
    const endMonth = format(weekEnd, 'MMM');
    const startDay = format(weekStart, 'd');
    const endDay = format(weekEnd, 'd');
    const year = format(weekEnd, 'yyyy');
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };
  
  /**
   * Format time for display
   * Example: "9:00 AM", "2:30 PM"
   */
  export const formatTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };
  
  /**
   * Format time for time grid labels
   * Example: "9 AM", "2 PM"
   */
  export const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };
  
  /**
   * Parse ISO date string to Date object
   */
  export const parseDate = (dateString: string): Date => {
    return parseISO(dateString);
  };
  
  /**
   * Convert Date to ISO string for API
   */
  export const toISOString = (date: Date): string => {
    return date.toISOString();
  };
  
  /**
   * Create a Date object from day and time
   */
  export const createDateTime = (day: Date, hour: number, minute: number = 0): Date => {
    const date = startOfDay(day);
    return setMinutes(setHours(date, hour), minute);
  };
  
  /**
   * Format date for datetime-local input
   * Format: "YYYY-MM-DDTHH:mm"
   */
  export const formatForDateTimeInput = (date: Date): string => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };
  
  /**
   * Get hours and minutes from Date
   */
  export const getTimeComponents = (date: Date): { hours: number; minutes: number } => {
    return {
      hours: getHours(date),
      minutes: getMinutes(date),
    };
  };
  
  /**
   * Calculate event duration in minutes
   */
  export const getEventDuration = (startTime: Date, endTime: Date): number => {
    return differenceInMinutes(endTime, startTime);
  };
  
  /**
   * Check if two date ranges overlap
   */
  export const doEventsOverlap = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean => {
    return start1 < end2 && end1 > start2;
  };
  
  /**
   * Calculate event position in grid (top percentage)
   */
  export const calculateEventTop = (startTime: Date): number => {
    const hours = getHours(startTime);
    const minutes = getMinutes(startTime);
    const totalMinutesFromStart = (hours - GRID_START_HOUR) * 60 + minutes;
    const totalGridMinutes = GRID_HOURS * 60;
    return (totalMinutesFromStart / totalGridMinutes) * 100;
  };
  
  /**
   * Calculate event height in grid (height percentage)
   */
  export const calculateEventHeight = (startTime: Date, endTime: Date): number => {
    const durationMinutes = differenceInMinutes(endTime, startTime);
    const totalGridMinutes = GRID_HOURS * 60;
    return (durationMinutes / totalGridMinutes) * 100;
  };