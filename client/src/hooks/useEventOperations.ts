import { useState, useCallback } from 'react';
import { useCalendar } from './useCalendar';
import { eventApi } from '@/services/api';
import { transformApiEvent } from '@/utils/eventHelpers';
import type { CreateEventPayload, UpdateEventPayload } from '@/types';

interface UseEventOperationsReturn {
  isLoading: boolean;
  error: string | null;
  createEvent: (data: CreateEventPayload) => Promise<boolean>;
  updateEvent: (id: string, data: UpdateEventPayload) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useEventOperations = (): UseEventOperationsReturn => {
  const { addEvent, updateEvent: updateEventState, deleteEvent: deleteEventState, closeModal } = useCalendar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const createEvent = useCallback(async (data: CreateEventPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiEvent = await eventApi.create(data);
      const event = transformApiEvent(apiEvent);
      addEvent(event);
      closeModal();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [addEvent, closeModal]);


  const updateEvent = useCallback(async (
    id: string,
    data: UpdateEventPayload
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiEvent = await eventApi.update(id, data);
      const event = transformApiEvent(apiEvent);
      updateEventState(event);
      closeModal();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateEventState, closeModal]);


  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await eventApi.delete(id);
      deleteEventState(id);
      closeModal();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deleteEventState, closeModal]);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError,
  };
};