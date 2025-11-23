
export interface CalendarEvent {
    id: string;           // MongoDB _id (transformed)
    title: string;
    startTime: Date;      // Parsed from ISO string
    endTime: Date;
    color: string;        // Hex color code
    description?: string;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  /**
   * Event Form Data
   * Used when creating/editing events in the modal
   */
  export interface EventFormData {
    title: string;
    startTime: string;    // ISO string for datetime-local input
    endTime: string;
    color: string;
    description: string;
    location: string;
  }
  
  /**
   * Event Position
   * Calculated position for rendering events in the grid
   */
  export interface EventPosition {
    top: string;          // CSS percentage
    height: string;       // CSS percentage
    left: string;         // For overlapping events
    width: string;        // For overlapping events
  }
  
  /**
   * Positioned Event
   * Event with calculated display position
   */
  export interface PositionedEvent extends CalendarEvent {
    position: EventPosition;
    column: number;       // Column index for overlap handling
    totalColumns: number; // Total columns in same time range
  }
  
  /**
   * Drag State
   * Tracks drag-and-drop operations
   */
  export interface DragState {
    isDragging: boolean;
    event: CalendarEvent | null;
    initialY: number;
    currentY: number;
    originalStartTime: Date | null;
  }
  
  /**
   * Time Slot
   * Represents a clickable time slot for event creation
   */
  export interface TimeSlot {
    date: Date;
    hour: number;
    minute: number;
  }
  
  /**
   * Week Day
   * Represents a day in the week view
   */
  export interface WeekDay {
    date: Date;
    dayName: string;      // "Mon", "Tue", etc.
    dayNumber: number;    // 1-31
    isToday: boolean;
    events: CalendarEvent[];
  }
  
  /**
   * Calendar View State
   * Global calendar state structure
   */
  export interface CalendarState {
    currentWeekStart: Date;
    events: CalendarEvent[];
    selectedEvent: CalendarEvent | null;
    isModalOpen: boolean;
    modalMode: 'create' | 'edit';
    selectedSlot: TimeSlot | null;
    loading: boolean;
    error: string | null;
  }
  
  /**
   * Calendar Actions
   * All possible state mutations
   */
  export type CalendarAction =
    | { type: 'SET_WEEK'; payload: Date }
    | { type: 'NEXT_WEEK' }
    | { type: 'PREV_WEEK' }
    | { type: 'TODAY' }
    | { type: 'SET_EVENTS'; payload: CalendarEvent[] }
    | { type: 'ADD_EVENT'; payload: CalendarEvent }
    | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
    | { type: 'DELETE_EVENT'; payload: string }
    | { type: 'SELECT_EVENT'; payload: CalendarEvent }
    | { type: 'SELECT_SLOT'; payload: TimeSlot }
    | { type: 'OPEN_MODAL'; payload: 'create' | 'edit' }
    | { type: 'CLOSE_MODAL' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };