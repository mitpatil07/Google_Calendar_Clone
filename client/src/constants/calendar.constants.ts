export const GRID_START_HOUR = 0;   
export const GRID_END_HOUR = 24;     
export const GRID_HOURS = GRID_END_HOUR - GRID_START_HOUR;
export const SLOT_HEIGHT_PX = 48;    
export const HALF_SLOT_HEIGHT_PX = SLOT_HEIGHT_PX / 2;

// Days configuration
export const DAYS_IN_WEEK = 7;
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_NAMES_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday'
];

// Event colors (Google Calendar palette)
export const EVENT_COLORS = [
  { name: 'Tomato', value: '#d50000' },
  { name: 'Flamingo', value: '#e67c73' },
  { name: 'Tangerine', value: '#f4511e' },
  { name: 'Banana', value: '#f6bf26' },
  { name: 'Sage', value: '#33b679' },
  { name: 'Basil', value: '#0b8043' },
  { name: 'Peacock', value: '#039be5' },
  { name: 'Blueberry', value: '#3f51b5' },
  { name: 'Lavender', value: '#7986cb' },
  { name: 'Grape', value: '#8e24aa' },
  { name: 'Graphite', value: '#616161' },
] as const;

// Default event settings
export const DEFAULT_EVENT_COLOR = '#039be5';
export const DEFAULT_EVENT_DURATION_MINUTES = 60;
export const MIN_EVENT_DURATION_MINUTES = 15;

// UI Configuration
export const TIME_COLUMN_WIDTH = 60; 
export const HEADER_HEIGHT = 60;


export const STORAGE_KEYS = {
  WEEK_START: 'calendar_week_start',
  VIEW_MODE: 'calendar_view_mode',
} as const;