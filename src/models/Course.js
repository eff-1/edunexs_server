import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  videoUrl: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'video', 'document'],
      default: 'link'
    }
  }],
  order: {
    type: Number,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  lessons: [lessonSchema],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Mobile Development', 
      'Data Science',
      'Machine Learning',
      'Design',
      'Business',
      'Marketing',
      'Photography',
      'Music',
      'Language',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  language: {
    type: String,
    default: 'English'
  },
  requirements: [{
    type: String,
    trim: true
  }],
  whatYouWillLearn: [{
    type: String,
    trim: true
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  completionCertificate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' })
courseSchema.index({ category: 1 })
courseSchema.index({ level: 1 })
courseSchema.index({ price: 1 })
courseSchema.index({ 'rating.average': -1 })
courseSchema.index({ createdAt: -1 })
courseSchema.index({ instructor: 1 })

// Calculate total duration when lessons are modified
courseSchema.pre('save', function(next) {
  if (this.isModified('lessons')) {
    this.totalDuration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)
  }
  next()
})

// Update rating when reviews are modified
courseSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0
    this.rating.count = 0
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10
    this.rating.count = this.reviews.length
  }
}

const Course = mongoose.model('Course', courseSchema)

export default Course