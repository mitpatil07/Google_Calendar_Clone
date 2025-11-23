import React from 'react';
import clsx from 'clsx';
import { EVENT_COLORS } from '@/constants/calendar.constants';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onChange,
  label = 'Color',
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex flex-wrap gap-2">
        {EVENT_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={clsx(
              'w-6 h-6 rounded-full',
              'transition-transform duration-150',
              'hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
              // Show ring when selected
              selectedColor === color.value && 'ring-2 ring-offset-2 ring-gray-600'
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
            aria-pressed={selectedColor === color.value}
          />
        ))}
      </div>
    </div>
  );
};