import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import EmailVerification from '../models/EmailVerification.js'
import { generateOTP, sendVerificationEmail, sendWelcomeEmail } from '../services/emailService.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register user and send verification email
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      country,
      academicLevel,
      targetExams,
      specialization,
      experience,
      qualifications
    } = req.body

    // Validation
    if (!name || !email || !password || !role || !country || !academicLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Role-specific validation
    if (role === 'tutor') {
      if (!specialization || !experience || !qualifications) {
        return res.status(400).json({
          success: false,
          message: 'Please provide specialization, experience, and qualifications for tutor registration'
        })
      }
    }

    if (role === 'student' && (!targetExams || targetExams.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one target exam'
      })
    }

    // Generate OTP
    const otp = generateOTP()
    console.log(`Generated OTP for ${email}: ${otp}`) // For development - remove in production

    // Prepare user data
    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role,
      country,
      academicLevel,
      targetExams: targetExams || [],
      specialization,
      experience,
      qualifications
    }

    // Delete any existing verification for this email
    await EmailVerification.deleteMany({ email: email.toLowerCase() })

    // Create new verification record
    const verification = new EmailVerification({
      email: email.toLowerCase(),
      otp,
      userData
    })

    await verification.save()

    // Send verification email
    const emailResult = await sendVerificationEmail(email, otp, name)
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Registration initiated. Please check your email for verification code.',
      data: {
        email: email.toLowerCase(),
        expiresIn: 300 // 5 minutes
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
})

// Verify email with OTP
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      })
    }

    // Find verification record
    const verification = await EmailVerification.findOne({
      email: email.toLowerCase(),
      isUsed: false
    })

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Verification code expired or not found. Please request a new code.'
      })
    }

    // Check attempts
    if (verification.attempts >= 5) {
      await EmailVerification.deleteOne({ _id: verification._id })
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new verification code.'
      })
    }

    // Verify OTP
    if (verification.otp !== otp) {
      verification.attempts += 1
      await verification.save()
      
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${5 - verification.attempts} attempts remaining.`
      })
    }

    // OTP is correct, create user
    const { userData } = verification

    // Create user (password will be hashed by User model pre-save hook)
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      country: userData.country,
      academicLevel: userData.academicLevel,
      targetExams: userData.targetExams,
      specialization: userData.specialization,
      experience: userData.experience,
      qualifications: userData.qualifications,
      isEmailVerified: true,
      isActive: true
    })

    await user.save()

    // Mark verification as used
    verification.isUsed = true
    await verification.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name, user.role)

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      academicLevel: user.academicLevel,
      targetExams: user.targetExams,
      specialization: user.specialization,
      experience: user.experience,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt
    }

    res.status(201).json({
      success: true,
      message: 'Email verified successfully! Welcome to Edunexs LearnSphere!',
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    })
  }
})

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Find existing verification
    const verification = await EmailVerification.findOne({
      email: email.toLowerCase(),
      isUsed: false
    })

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'No pending verification found for this email'
      })
    }

    // Generate new OTP
    const newOtp = generateOTP()
    console.log(`Generated new OTP for ${email}: ${newOtp}`) // For development

    // Update verification record
    verification.otp = newOtp
    verification.attempts = 0
    verification.expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    await verification.save()

    // Send new verification email
    const emailResult = await sendVerificationEmail(email, newOtp, verification.userData.name)
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email',
      data: {
        expiresIn: 300 // 5 minutes
      }
    })

  } catch (error) {
    console.error('Resend OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while resending verification code'
    })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email before logging in'
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      academicLevel: user.academicLevel,
      targetExams: user.targetExams,
      specialization: user.specialization,
      experience: user.experience,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
})

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: { user }
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// Logout (client-side token removal)
router.post('/logout', protect, async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    })
  }
})

export default router