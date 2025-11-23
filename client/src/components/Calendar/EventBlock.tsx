import React from 'react';
import clsx from 'clsx';
import { useCalendar } from '@/hooks';
import { formatTime, lightenColor } from '@/utils';
import type { PositionedEvent } from '@/types';

interface EventBlockProps {
  event: PositionedEvent;
}

export const EventBlock: React.FC<EventBlockProps> = ({ event }) => {
  const { openEditModal } = useCalendar();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(event);
  };

  const durationMs = event.endTime.getTime() - event.startTime.getTime();
  const isShort = durationMs < 60 * 60 * 1000;

  const backgroundColor = lightenColor(event.color, 85);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'absolute rounded-lg px-3 py-2',
        'cursor-pointer overflow-hidden',
        'border-l-[3px] shadow-sm',
        'hover:shadow-lg hover:scale-[1.02] hover:z-10',
        'active:scale-[0.98]',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1',
        'backdrop-blur-sm'
      )}
      style={{
        top: event.position.top,
        height: event.position.height,
        left: event.position.left,
        width: `calc(${event.position.width} - 6px)`,
        backgroundColor,
        borderLeftColor: event.color,
        minHeight: '24px',
      }}
      tabIndex={0}
      role="button"
      aria-label={`Event: ${event.title} at ${formatTime(event.startTime)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEditModal(event);
        }
      }}
    >
      <div className={clsx('flex h-full', isShort ? 'flex-row items-center gap-2' : 'flex-col gap-0.5')}>
        <p
          className={clsx(
            'font-semibold text-sm truncate leading-tight',
            'drop-shadow-sm'
          )}
          style={{ color: event.color }}
        >
          {event.title}
        </p>
        
        {!isShort && (
          <p className="text-xs text-gray-700 font-medium truncate opacity-90">
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </p>
        )}
        
        {event.location && !isShort && (
          <p className="text-xs text-gray-600 truncate mt-0.5 flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </p>
        )}
      </div>
    </div>
  );
};