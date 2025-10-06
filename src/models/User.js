import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'tutor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  country: {
    type: String,
    enum: ['Nigeria', 'Ghana', 'United Kingdom', 'United States'],
    required: [true, 'Country is required']
  },
  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date,
    default: null
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Academic information
  academicLevel: {
    type: String,
    enum: ['secondary', 'undergraduate', 'graduate', 'professional'],
    required: [true, 'Academic level is required']
  },
  
  // Student-specific fields
  targetExams: [{
    examCode: String,
    subjects: [String],
    targetYear: Number,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  
  // Tutor-specific fields (enhanced for comprehensive tutor management)
  specialization: {
    type: String,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'english', 'economics', 'geography', 'history', 'multiple', ''],
    required: false,
    default: ''
  },
  
  // Multiple subjects for tutors
  subjects: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    certifications: [String]
  }],
  
  experience: {
    type: String,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+', ''],
    required: false,
    default: ''
  },

  // Contact information for tutors
  contactMethods: {
    whatsapp: { type: Boolean, default: false },
    telegram: { type: Boolean, default: false },
    instagram: { type: Boolean, default: false },
    twitter: { type: Boolean, default: false }
  },
  whatsappNumber: {
    type: String,
    default: ''
  },
  telegramHandle: {
    type: String,
    default: ''
  },
  instagramHandle: {
    type: String,
    default: ''
  },
  twitterHandle: {
    type: String,
    default: ''
  },
  
  // Enhanced qualifications - now supports multiple entries
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
    field: String,
    grade: String
  }],
  
  // Additional tutor fields
  tutorProfile: {
    hourlyRate: {
      type: Number,
      default: 0
    },
    availability: [{
      day: String,
      startTime: String,
      endTime: String
    }],
    languages: [String],
    teachingStyle: String,
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    studentsCount: {
      type: Number,
      default: 0
    },
    sessionsCompleted: {
      type: Number,
      default: 0
    }
  },
  studyPreferences: {
    studyHours: {
      type: Number,
      default: 2 // hours per day
    },
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      default: 'evening'
    },
    studyDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }]
  },
  // Additional fields
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Login tracking
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Index for better query performance (email index is created by unique: true)
userSchema.index({ role: 1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Handle legacy data - convert string qualifications to array
userSchema.pre('save', function(next) {
  // Fix qualifications if it's a string (legacy data)
  if (typeof this.qualifications === 'string') {
    this.qualifications = []
  }
  
  // Fix subjects if it's not an array (legacy data)
  if (!Array.isArray(this.subjects)) {
    this.subjects = []
  }
  
  next()
})

// Also handle this during queries
userSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function() {
  // This will help with queries but the main fix is in the save hook
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
  
  return resetToken
}

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  delete user.passwordResetToken
  delete user.passwordResetExpires
  delete user.emailVerificationToken
  return user
}

const User = mongoose.model('User', userSchema)

export default User