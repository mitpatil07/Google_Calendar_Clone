import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  ApiResponse,
  ApiEvent,
  CreateEventPayload,
  UpdateEventPayload,
  EventQueryParams,
} from '@/types';

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  // In development, Vite proxy handles /api -> localhost:5000
  // In production, this would be the full API URL
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Response interceptor for error handling
 * Transforms errors into consistent format
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Extract error message from API response or use generic message
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';
    
    console.error('API Error:', message);
    
    // Re-throw with enhanced error
    return Promise.reject(new Error(message));
  }
);

/**
 * Event API Functions
 */

/**
 * Fetch events with optional date range filter
 */
export const fetchEvents = async (
  params?: EventQueryParams
): Promise<ApiEvent[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.start) queryParams.append('start', params.start);
  if (params?.end) queryParams.append('end', params.end);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/events?${queryString}` : '/events';
  
  const response = await apiClient.get<ApiResponse<ApiEvent[]>>(url);
  return response.data.data || [];
};

/**
 * Fetch single event by ID
 */
export const fetchEventById = async (id: string): Promise<ApiEvent> => {
  const response = await apiClient.get<ApiResponse<ApiEvent>>(`/events/${id}`);
  
  if (!response.data.data) {
    throw new Error('Event not found');
  }
  
  return response.data.data;
};

/**
 * Create new event
 */
export const createEvent = async (
  payload: CreateEventPayload
): Promise<ApiEvent> => {
  const response = await apiClient.post<ApiResponse<ApiEvent>>(
    '/events',
    payload
  );
  
  if (!response.data.data) {
    throw new Error('Failed to create event');
  }
  
  return response.data.data;
};

/**
 * Update existing event
 */
export const updateEvent = async (
  id: string,
  payload: UpdateEventPayload
): Promise<ApiEvent> => {
  const response = await apiClient.put<ApiResponse<ApiEvent>>(
    `/events/${id}`,
    payload
  );
  
  if (!response.data.data) {
    throw new Error('Failed to update event');
  }
  
  return response.data.data;
};

/**
 * Delete event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  await apiClient.delete<ApiResponse<{ id: string }>>(`/events/${id}`);
};


export const eventApi = {
  fetchAll: fetchEvents,
  fetchById: fetchEventById,
  create: createEvent,
  update: updateEvent,
  delete: deleteEvent,
};