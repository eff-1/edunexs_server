import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    }
  }],
  quizScores: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    passed: {
      type: Boolean,
      default: false
    },
    attempt: {
      type: Number,
      default: 1
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    answers: [{
      question: mongoose.Schema.Types.ObjectId,
      answer: String,
      isCorrect: Boolean,
      points: Number
    }]
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Compound indexes
progressSchema.index({ user: 1, course: 1 }, { unique: true })
progressSchema.index({ user: 1 })
progressSchema.index({ course: 1 })
progressSchema.index({ isCompleted: 1 })

// Calculate overall progress
progressSchema.methods.calculateProgress = async function() {
  try {
    const course = await mongoose.model('Course').findById(this.course)
    if (!course || course.lessons.length === 0) {
      this.overallProgress = 0
      return
    }

    const completedCount = this.completedLessons.length
    const totalLessons = course.lessons.length
    
    this.overallProgress = Math.round((completedCount / totalLessons) * 100)
    
    // Mark as completed if all lessons are done
    if (this.overallProgress === 100 && !this.isCompleted) {
      this.isCompleted = true
      this.completedAt = new Date()
    }
    
    // Calculate total time spent
    this.totalTimeSpent = this.completedLessons.reduce((total, lesson) => {
      return total + (lesson.timeSpent || 0)
    }, 0)
    
  } catch (error) {
    console.error('Error calculating progress:', error)
  }
}

// Update last accessed
progressSchema.methods.updateLastAccessed = function() {
  this.lastAccessedAt = new Date()
}

const Progress = mongoose.model('Progress', progressSchema)

export default Progress