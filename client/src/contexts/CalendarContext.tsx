import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import type { CalendarState, CalendarAction, CalendarEvent, TimeSlot } from '@/types';
import { getWeekStart, getNextWeek, getPrevWeek, getWeekEnd, toISOString } from '@/utils';
import { eventApi } from '@/services/api';
import { transformApiEvents } from '@/utils/eventHelpers';

const initialState: CalendarState = {
  currentWeekStart: getWeekStart(new Date()),
  events: [],
  selectedEvent: null,
  isModalOpen: false,
  modalMode: 'create',
  selectedSlot: null,
  loading: false,
  error: null,
};


const calendarReducer = (
  state: CalendarState,
  action: CalendarAction
): CalendarState => {
  switch (action.type) {
    case 'SET_WEEK':
      return { ...state, currentWeekStart: getWeekStart(action.payload) };
    
    case 'NEXT_WEEK':
      return { ...state, currentWeekStart: getNextWeek(state.currentWeekStart) };
    
    case 'PREV_WEEK':
      return { ...state, currentWeekStart: getPrevWeek(state.currentWeekStart) };
    
    case 'TODAY':
      return { ...state, currentWeekStart: getWeekStart(new Date()) };
    
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    
    case 'SELECT_EVENT':
      return { ...state, selectedEvent: action.payload };
    
    case 'SELECT_SLOT':
      return { ...state, selectedSlot: action.payload };
    
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true, modalMode: action.payload };
    
    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        selectedEvent: null,
        selectedSlot: null,
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};


interface CalendarContextType {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  goToToday: () => void;
  openCreateModal: (slot?: TimeSlot) => void;
  openEditModal: (event: CalendarEvent) => void;
  closeModal: () => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  fetchEvents: () => Promise<void>;
}


export const CalendarContext = createContext<CalendarContextType | null>(null);


export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);


  const fetchEvents = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const weekEnd = getWeekEnd(state.currentWeekStart);
      const apiEvents = await eventApi.fetchAll({
        start: toISOString(state.currentWeekStart),
        end: toISOString(weekEnd),
      });
      
      const events = transformApiEvents(apiEvents);
      dispatch({ type: 'SET_EVENTS', payload: events });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch events';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentWeekStart]);


  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);


  const goToNextWeek = useCallback(() => {
    dispatch({ type: 'NEXT_WEEK' });
  }, []);

  const goToPrevWeek = useCallback(() => {
    dispatch({ type: 'PREV_WEEK' });
  }, []);

  const goToToday = useCallback(() => {
    dispatch({ type: 'TODAY' });
  }, []);

  const openCreateModal = useCallback((slot?: TimeSlot) => {
    if (slot) {
      dispatch({ type: 'SELECT_SLOT', payload: slot });
    }
    dispatch({ type: 'OPEN_MODAL', payload: 'create' });
  }, []);

  const openEditModal = useCallback((event: CalendarEvent) => {
    dispatch({ type: 'SELECT_EVENT', payload: event });
    dispatch({ type: 'OPEN_MODAL', payload: 'edit' });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const addEvent = useCallback((event: CalendarEvent) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
  }, []);

  const updateEventAction = useCallback((event: CalendarEvent) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
  }, []);

  const deleteEventAction = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  }, []);

  const value: CalendarContextType = {
    state,
    dispatch,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    openCreateModal,
    openEditModal,
    closeModal,
    addEvent,
    updateEvent: updateEventAction,
    deleteEvent: deleteEventAction,
    fetchEvents,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};