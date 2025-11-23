import React from 'react';
import { useCalendar } from '@/hooks';
import { Button } from '@/components/ui';
import { formatWeekRange } from '@/utils';

export const NavigationBar: React.FC = () => {
  const { state, goToNextWeek, goToPrevWeek, goToToday, openCreateModal } = useCalendar();

  return (
    <header className="w-full bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-lg tracking-tight">C</span>
              </div>

              <div className="hidden sm:flex flex-col">
                <span className="text-gray-900 font-semibold text-lg">Calendar</span>
                <span className="text-sm text-gray-500">Personal planner</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100"
                aria-label="Go to today"
              >
                Today
              </Button>

              <div className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-sm">
                <button
                  onClick={goToPrevWeek}
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300"
                  aria-label="Previous week"
                  title="Previous week"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={goToNextWeek}
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300"
                  aria-label="Next week"
                  title="Next week"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <span className="text-sm text-gray-500 mr-3 hidden sm:inline">Week</span>
              <div className="text-base font-medium text-gray-900">{formatWeekRange(state.currentWeekStart)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-sm text-gray-600">View</div>
              <div className="inline-flex items-center bg-white border border-gray-200 rounded-md overflow-hidden">
                <button className="px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none">Week</button>
                <button className="px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none">Month</button>
                <button className="px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none">Agenda</button>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              className="hidden sm:inline-flex"
            >
              Print
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => openCreateModal()}
              className="flex items-center gap-2 px-4 py-2"
              aria-label="Create event"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};