import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import EmailVerification from '../models/EmailVerification.js'
import { generateOTP, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register user and send verification email
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body.email)
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

    // Create user directly without email verification (password will be hashed by User model)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: password, // Let User model handle hashing
      role,
      country,
      academicLevel,
      targetExams: targetExams || [],
      specialization,
      experience,
      qualifications,
      isEmailVerified: true, // Auto-verify since we're skipping email verification
      emailVerifiedAt: new Date()
    })

    await user.save()
    console.log('✅ User created successfully:', user.email)

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

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
      qualifications: user.qualifications,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! You are now logged in.',
      data: {
        user: userResponse,
        token: token
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

// Email verification removed - users are auto-verified on registration

// Resend OTP endpoint removed - no longer needed without email verification

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

    // Email verification removed - all users can login directly

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

// Forgot Password - Send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      })
    }

    // Generate reset OTP
    const resetOTP = generateOTP()
    
    // Store reset OTP in EmailVerification collection (reusing existing structure)
    await EmailVerification.findOneAndUpdate(
      { email },
      {
        email,
        otp: resetOTP,
        userData: { name: user.name, type: 'password-reset' },
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      },
      { upsert: true, new: true }
    )

    // Send password reset email via Gmail SMTP
    const emailResult = await sendPasswordResetEmail(email, resetOTP, user.name)

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    })
  }
})

// Reset Password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    // Find and verify OTP
    const verification = await EmailVerification.findOne({ email, otp })
    
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      })
    }

    // Check if OTP is expired
    if (verification.expiresAt < new Date()) {
      await EmailVerification.deleteOne({ email })
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired. Please request a new one.'
      })
    }

    // Find user and update password
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Hash new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update user password
    user.password = hashedPassword
    await user.save()

    // Clean up verification record
    await EmailVerification.deleteOne({ email })

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    })
  }
})

export default router