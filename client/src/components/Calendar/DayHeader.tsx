import React from 'react';
import clsx from 'clsx';
import type { WeekDay } from '@/types';

interface DayHeaderProps {
  day: WeekDay;
}

export const DayHeader: React.FC<DayHeaderProps> = ({ day }) => {
  return (
    <div className="flex flex-col items-center py-3 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50/50">
      <span
        className={clsx(
          'text-xs font-semibold uppercase tracking-wider mb-1.5',
          day.isToday ? 'text-blue-600' : 'text-gray-600'
        )}
      >
        {day.dayName}
      </span>
      
      <div className="relative">
        <span
          className={clsx(
            'flex items-center justify-center',
            'w-12 h-12 text-xl font-semibold',
            'rounded-full transition-all duration-200',
            day.isToday
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
              : 'text-gray-800 hover:bg-gray-100 hover:scale-105 cursor-default'
          )}
          aria-current={day.isToday ? 'date' : undefined}
        >
          {day.dayNumber}
        </span>
        {day.isToday && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};