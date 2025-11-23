import React from 'react';
import { GRID_START_HOUR, GRID_END_HOUR, SLOT_HEIGHT_PX } from '@/constants/calendar.constants';
import { formatHour } from '@/utils';

export const TimeGrid: React.FC = () => {
  const hours = Array.from(
    { length: GRID_END_HOUR - GRID_START_HOUR },
    (_, i) => GRID_START_HOUR + i
  );

  return (
    <div className="flex-shrink-0 w-20 border-r border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <div className="h-[60px] border-b border-gray-200 bg-gradient-to-b from-white to-gray-50/50" />
      
      <div className="relative">
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative group"
            style={{ height: `${SLOT_HEIGHT_PX}px` }}
          >
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
            
            <span
              className="absolute -top-2.5 right-3 text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors"
              aria-hidden="true"
            >
              {formatHour(hour)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};