import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  examCode: {
    type: String,
    required: [true, 'Exam code is required'],
    ref: 'Exam'
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required']
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-in-blank'],
    default: 'multiple-choice'
  },
  options: [{
    label: String, // A, B, C, D
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required']
  },
  explanation: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  topic: {
    type: String,
    required: [true, 'Topic is required']
  },
  subtopic: String,
  points: {
    type: Number,
    default: 1
  },
  timeAllocation: {
    type: Number, // seconds per question
    default: 90
  },
  source: {
    type: String, // e.g., "JAMB 2023", "WAEC 2022"
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tags: [String],
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    correctAttempts: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number, // in seconds
      default: 0
    }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
questionSchema.index({ examCode: 1, subject: 1 })
questionSchema.index({ year: 1 })
questionSchema.index({ difficulty: 1 })
questionSchema.index({ topic: 1 })
questionSchema.index({ isVerified: 1 })

// Update statistics when question is answered
questionSchema.methods.updateStatistics = function(isCorrect, timeSpent) {
  this.statistics.totalAttempts += 1
  if (isCorrect) {
    this.statistics.correctAttempts += 1
  }
  
  // Update average time
  const totalTime = this.statistics.averageTime * (this.statistics.totalAttempts - 1) + timeSpent
  this.statistics.averageTime = Math.round(totalTime / this.statistics.totalAttempts)
}

const Question = mongoose.model('Question', questionSchema)

export default Question