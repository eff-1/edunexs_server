import mongoose from 'mongoose'

const tutorRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examCode: {
    type: String,
    required: [true, 'Exam code is required']
  },
  subjects: [{
    type: String,
    required: true
  }],
  preferredSchedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    timeSlots: [{
      start: String, // e.g., "09:00"
      end: String    // e.g., "11:00"
    }],
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  learningGoals: {
    type: String,
    required: [true, 'Learning goals are required']
  },
  currentLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  budget: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    per: {
      type: String,
      enum: ['hour', 'session', 'month'],
      default: 'hour'
    }
  },
  sessionType: {
    type: String,
    enum: ['one-on-one', 'group', 'either'],
    default: 'one-on-one'
  },
  urgency: {
    type: String,
    enum: ['immediate', 'within-week', 'within-month', 'flexible'],
    default: 'flexible'
  },
  additionalRequirements: String,
  status: {
    type: String,
    enum: ['pending', 'matched', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  matchedTutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  matchedAt: Date,
  adminNotes: String,
  studentContact: {
    email: String,
    phone: String,
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'platform'],
      default: 'email'
    }
  }
}, {
  timestamps: true
})

// Indexes
tutorRequestSchema.index({ student: 1 })
tutorRequestSchema.index({ status: 1 })
tutorRequestSchema.index({ examCode: 1 })
tutorRequestSchema.index({ createdAt: -1 })

const TutorRequest = mongoose.model('TutorRequest', tutorRequestSchema)

export default TutorRequest