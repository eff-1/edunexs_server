import mongoose from 'mongoose'

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Exam code is required'],
    unique: true,
    uppercase: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    enum: ['Nigeria', 'Ghana', 'United Kingdom', 'United States']
  },
  description: {
    type: String,
    required: [true, 'Exam description is required']
  },
  subjects: [{
    name: String,
    code: String,
    duration: Number, // in minutes
    totalQuestions: Number
  }],
  examType: {
    type: String,
    enum: ['CBT', 'Paper-based', 'Both'],
    default: 'CBT'
  },
  duration: {
    type: Number, // total exam duration in minutes
    required: true
  },
  passingScore: {
    type: Number,
    default: 50 // percentage
  },
  isActive: {
    type: Boolean,
    default: true
  },
  examBody: {
    type: String, // e.g., "JAMB", "WAEC", "College Board"
    required: true
  },
  officialWebsite: String,
  examPeriods: [{
    year: Number,
    startDate: Date,
    endDate: Date,
    registrationDeadline: Date
  }]
}, {
  timestamps: true
})

// Index for better query performance
examSchema.index({ country: 1, code: 1 })
examSchema.index({ isActive: 1 })

const Exam = mongoose.model('Exam', examSchema)

export default Exam