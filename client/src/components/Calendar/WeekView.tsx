import React, { useEffect, useRef } from 'react';
import { useCalendar } from '@/hooks';
import { TimeGrid } from './TimeGrid';
import { DayColumn } from './DayColumn';
import { getWeekDays } from '@/utils';
import { SLOT_HEIGHT_PX, GRID_START_HOUR } from '@/constants/calendar.constants';

export const WeekView: React.FC = () => {
  const { state } = useCalendar();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const weekDays = getWeekDays(state.currentWeekStart, state.events);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollToHour = Math.max(0, currentHour - 2);
      const scrollPosition = scrollToHour * SLOT_HEIGHT_PX;
      
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {state.loading && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-3 border border-blue-500/20">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="font-medium">Loading events...</span>
          </div>
        </div>
      )}

      {state.error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-b-2 border-red-300 px-6 py-3 flex items-center gap-3 shadow-sm animate-slide-up">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-700 text-sm font-medium">{state.error}</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        <div className="flex min-w-[900px] shadow-inner">
          <TimeGrid />

          <div className="flex-1 flex bg-white shadow-sm">
            {weekDays.map((day) => (
              <DayColumn key={day.date.toISOString()} day={day} />
            ))}
          </div>
        </div>
      </div>

      {!state.loading && state.events.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-sm px-6 py-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No events scheduled</h3>
            <p className="text-sm text-gray-500 mb-4">Click on any time slot to create your first event</p>
            <div className="inline-flex items-center gap-2 text-xs text-blue-600 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tip: Use the Create button to get started
            </div>
          </div>
        </div>
      )}
    </div>
  );
};