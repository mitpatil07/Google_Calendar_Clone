export interface ApiEvent {
    id: string;
    title: string;
    startTime: string;    // ISO string from API
    endTime: string;      // ISO string from API
    color: string;
    description?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * API Response Wrapper
   * Consistent structure from backend
   */
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  }
  
  /**
   * Create Event Payload
   * Sent to POST /api/events
   */
  export interface CreateEventPayload {
    title: string;
    startTime: string;    // ISO string
    endTime: string;
    color: string;
    description?: string;
    location?: string;
  }
  
  /**
   * Update Event Payload
   * Sent to PUT /api/events/:id
   */
  export interface UpdateEventPayload {
    title?: string;
    startTime?: string;
    endTime?: string;
    color?: string;
    description?: string;
    location?: string;
  }
  

  export interface EventQueryParams {
    start?: string;
    end?: string;
  }