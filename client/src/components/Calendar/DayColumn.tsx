import React, { useCallback, useRef } from 'react';
import clsx from 'clsx';
import { useCalendar } from '@/hooks';
import { DayHeader } from './DayHeader';
import { EventBlock } from './EventBlock';
import { calculateEventColumns, getEventsForDay } from '@/utils';
import { GRID_START_HOUR, GRID_END_HOUR, SLOT_HEIGHT_PX } from '@/constants/calendar.constants';
import type { WeekDay, TimeSlot } from '@/types';

interface DayColumnProps {
  day: WeekDay;
}

export const DayColumn: React.FC<DayColumnProps> = ({ day }) => {
  const { state, openCreateModal } = useCalendar();
  const columnRef = useRef<HTMLDivElement>(null);

  // Generate hour slots
  const hours = Array.from(
    { length: GRID_END_HOUR - GRID_START_HOUR },
    (_, i) => GRID_START_HOUR + i
  );

  // Get events for this day and calculate positions
  const dayEvents = getEventsForDay(state.events, day.date);
  const positionedEvents = calculateEventColumns(dayEvents);


  const handleColumnClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!columnRef.current) return;

    // Get click position relative to the column
    const rect = columnRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;

    // Calculate which hour was clicked
    const totalHeight = SLOT_HEIGHT_PX * (GRID_END_HOUR - GRID_START_HOUR);
    const clickRatio = relativeY / totalHeight;
    const totalMinutes = (GRID_END_HOUR - GRID_START_HOUR) * 60;
    const minutesFromStart = Math.floor(clickRatio * totalMinutes);

    // Snap to 30-minute intervals
    const snappedMinutes = Math.floor(minutesFromStart / 30) * 30;
    const hour = GRID_START_HOUR + Math.floor(snappedMinutes / 60);
    const minute = snappedMinutes % 60;

    // Create time slot
    const slot: TimeSlot = {
      date: day.date,
      hour,
      minute,
    };

    openCreateModal(slot);
  }, [day.date, openCreateModal]);

  return (
    <div className="flex-1 flex flex-col border-r border-gray-200 last:border-r-0 min-w-[100px]">
      {/* Day Header */}
      <DayHeader day={day} />

      {/* Time Slots */}
      <div
        ref={columnRef}
        className={clsx(
          'relative flex-1 cursor-pointer',
          'hover:bg-gray-50/50 transition-colors'
        )}
        onClick={handleColumnClick}
        role="button"
        aria-label={`Create event on ${day.dayName} ${day.dayNumber}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            openCreateModal({ date: day.date, hour: 9, minute: 0 });
          }
        }}
      >
        {/* Hour grid lines */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="border-b border-gray-100"
            style={{ height: `${SLOT_HEIGHT_PX}px` }}
          />
        ))}

        {/* Events layer */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative h-full pointer-events-auto">
            {positionedEvents.map((event) => (
              <EventBlock key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Current time indicator (only for today) */}
        {day.isToday && <CurrentTimeIndicator />}
      </div>
    </div>
  );
};


const CurrentTimeIndicator: React.FC = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Calculate position
  const totalMinutesFromStart = (hours - GRID_START_HOUR) * 60 + minutes;
  const totalGridMinutes = (GRID_END_HOUR - GRID_START_HOUR) * 60;
  const topPercentage = (totalMinutesFromStart / totalGridMinutes) * 100;

  // Don't show if outside grid hours
  if (hours < GRID_START_HOUR || hours >= GRID_END_HOUR) {
    return null;
  }

  return (
    <div
      className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
      style={{ top: `${topPercentage}%` }}
    >
      {/* Red dot */}
      <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5" />
      {/* Red line */}
      <div className="flex-1 h-0.5 bg-red-500" />
    </div>
  );
};