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
  
  // Tutor-specific fields
  specialization: {
    type: String,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'english', 'economics', 'geography', 'history', 'multiple'],
    required: function() { return this.role === 'tutor' }
  },
  experience: {
    type: String,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+'],
    required: function() { return this.role === 'tutor' }
  },
  qualifications: {
    type: String,
    required: function() { return this.role === 'tutor' },
    maxlength: [1000, 'Qualifications cannot exceed 1000 characters']
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
  academicLevel: {
    type: String,
    enum: ['Secondary', 'Pre-University', 'University', 'Graduate'],
    required: true
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
  // For tutors
  tutorProfile: {
    specializations: [String], // exam codes they can teach
    subjects: [String],
    experience: Number, // years
    qualifications: [String],
    hourlyRate: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    availability: [{
      day: String,
      timeSlots: [{
        start: String,
        end: String
      }]
    }],
    rating: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    languages: [String]
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  
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