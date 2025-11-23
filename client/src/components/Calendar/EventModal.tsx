import React, { useState, useEffect } from 'react';
import { useCalendar, useEventOperations } from '@/hooks';
import { Modal, Button, Input, ColorPicker } from '@/components/ui';
import { formatForDateTimeInput, createDateTime } from '@/utils';
import { DEFAULT_EVENT_COLOR, DEFAULT_EVENT_DURATION_MINUTES } from '@/constants/calendar.constants';
import type { EventFormData } from '@/types';

export const EventModal: React.FC = () => {
  const { state, closeModal } = useCalendar();
  const { isLoading, error, createEvent, updateEvent, deleteEvent, clearError } = useEventOperations();
  
  const isEditMode = state.modalMode === 'edit';
  const title = isEditMode ? 'Edit Event' : 'Create Event';

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    startTime: '',
    endTime: '',
    color: DEFAULT_EVENT_COLOR,
    description: '',
    location: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});


  useEffect(() => {
    if (state.isModalOpen) {
      clearError();
      setErrors({});

      if (isEditMode && state.selectedEvent) {
        setFormData({
          title: state.selectedEvent.title,
          startTime: formatForDateTimeInput(state.selectedEvent.startTime),
          endTime: formatForDateTimeInput(state.selectedEvent.endTime),
          color: state.selectedEvent.color,
          description: state.selectedEvent.description || '',
          location: state.selectedEvent.location || '',
        });
      } else if (state.selectedSlot) {
        const startDate = createDateTime(
          state.selectedSlot.date,
          state.selectedSlot.hour,
          state.selectedSlot.minute
        );
        const endDate = new Date(startDate.getTime() + DEFAULT_EVENT_DURATION_MINUTES * 60 * 1000);

        setFormData({
          title: '',
          startTime: formatForDateTimeInput(startDate),
          endTime: formatForDateTimeInput(endDate),
          color: DEFAULT_EVENT_COLOR,
          description: '',
          location: '',
        });
      } else {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        now.setHours(now.getHours() + 1);
        const endDate = new Date(now.getTime() + DEFAULT_EVENT_DURATION_MINUTES * 60 * 1000);

        setFormData({
          title: '',
          startTime: formatForDateTimeInput(now),
          endTime: formatForDateTimeInput(endDate),
          color: DEFAULT_EVENT_COLOR,
          description: '',
          location: '',
        });
      }
    }
  }, [state.isModalOpen, state.selectedEvent, state.selectedSlot, isEditMode, clearError]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof EventFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };


  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      }

      const duration = (end.getTime() - start.getTime()) / (1000 * 60);
      if (duration < 15) {
        newErrors.endTime = 'Event must be at least 15 minutes';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const payload = {
      title: formData.title.trim(),
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      color: formData.color,
      description: formData.description.trim() || undefined,
      location: formData.location.trim() || undefined,
    };

    if (isEditMode && state.selectedEvent) {
      await updateEvent(state.selectedEvent.id, payload);
    } else {
      await createEvent(payload);
    }
  };

  const handleDelete = async () => {
    if (state.selectedEvent && confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(state.selectedEvent.id);
    }
  };

  return (
    <Modal isOpen={state.isModalOpen} onClose={closeModal} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* API Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Add title"
          autoFocus
        />

        <Input
          label="Start"
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          error={errors.startTime}
        />

        <Input
          label="End"
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          error={errors.endTime}
        />

        <ColorPicker
          selectedColor={formData.color}
          onChange={handleColorChange}
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Add location"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add description"
          />
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div>
            {isEditMode && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {isEditMode ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};