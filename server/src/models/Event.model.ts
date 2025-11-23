import mongoose, { Schema, Model } from 'mongoose';
import { IEventDocument } from '../types/event.types';


const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      validate: {
        validator: function(this: IEventDocument, value: Date) {
          // Ensure startTime is before endTime
          return !this.endTime || value < this.endTime;
        },
        message: 'Start time must be before end time',
      },
    },
    
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function(this: IEventDocument, value: Date) {
          // Ensure endTime is after startTime
          return !this.startTime || value > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    
    color: {
      type: String,
      required: [true, 'Event color is required'],
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex code'],
      default: '#3b82f6', // Default blue color
    },
    
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
    
    // Customize JSON output (remove __v, rename _id to id)
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

eventSchema.index({ startTime: 1, endTime: 1 });

/**
 * Pre-save Middleware
 * Validates business logic before saving to database
 */
eventSchema.pre('save', function(next) {
  // Additional validation: event must be at least 15 minutes
  const duration = this.endTime.getTime() - this.startTime.getTime();
  const fifteenMinutes = 15 * 60 * 1000;
  
  if (duration < fifteenMinutes) {
    next(new Error('Event duration must be at least 15 minutes'));
  } else {
    next();
  }
});

/**
 * Static Method: Find Events in Date Range
 * Reusable query for fetching events within a specific timeframe
 */
eventSchema.statics.findByDateRange = function(
  startDate: Date,
  endDate: Date
) {
  return this.find({
    startTime: { $lte: endDate },
    endTime: { $gte: startDate },
  }).sort({ startTime: 1 });
};

// Create and export model
const Event: Model<IEventDocument> = mongoose.model<IEventDocument>(
  'Event',
  eventSchema
);

export default Event;