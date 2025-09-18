import mongoose from 'mongoose'

const practiceSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examCode: {
    type: String,
    required: [true, 'Exam code is required'],
    ref: 'Exam'
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  sessionType: {
    type: String,
    enum: ['practice', 'mock-exam', 'timed-practice', 'topic-based'],
    default: 'practice'
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number, // in seconds
    skipped: {
      type: Boolean,
      default: false
    }
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  skippedQuestions: {
    type: Number,
    default: 0
  },
  score: {
    type: Number, // percentage
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  timeLimit: {
    type: Number, // in seconds
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
    default: 'Mixed'
  },
  topics: [String], // specific topics covered
  performance: {
    accuracy: Number, // percentage
    speed: Number, // questions per minute
    consistency: Number, // performance consistency score
    strongTopics: [String],
    weakTopics: [String]
  }
}, {
  timestamps: true
})

// Indexes
practiceSessionSchema.index({ user: 1, examCode: 1 })
practiceSessionSchema.index({ user: 1, createdAt: -1 })
practiceSessionSchema.index({ examCode: 1, subject: 1 })

// Calculate performance metrics
practiceSessionSchema.methods.calculatePerformance = function() {
  if (this.totalQuestions === 0) return
  
  this.correctAnswers = this.questions.filter(q => q.isCorrect).length
  this.wrongAnswers = this.questions.filter(q => !q.isCorrect && !q.skipped).length
  this.skippedQuestions = this.questions.filter(q => q.skipped).length
  
  this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100)
  this.totalTimeSpent = this.questions.reduce((total, q) => total + (q.timeSpent || 0), 0)
  
  // Calculate accuracy
  const attemptedQuestions = this.totalQuestions - this.skippedQuestions
  this.performance.accuracy = attemptedQuestions > 0 
    ? Math.round((this.correctAnswers / attemptedQuestions) * 100) 
    : 0
  
  // Calculate speed (questions per minute)
  const timeInMinutes = this.totalTimeSpent / 60
  this.performance.speed = timeInMinutes > 0 
    ? Math.round((this.totalQuestions / timeInMinutes) * 100) / 100 
    : 0
  
  // Mark as completed
  this.isCompleted = true
  this.completedAt = new Date()
  this.endTime = new Date()
}

const PracticeSession = mongoose.model('PracticeSession', practiceSessionSchema)

export default PracticeSession