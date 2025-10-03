import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './src/models/User.js'
import EmailVerification from './src/models/EmailVerification.js'
import { sendVerificationEmailSmart, sendWelcomeEmailSmart, sendPasswordResetEmailSmart } from './src/services/emailFallbackService.js'
import { generateOTP } from './src/services/emailService.js'
import bcrypt from 'bcryptjs'

// Load environment variables
dotenv.config()

async function testAuthFunctions() {
  try {
    console.log('🧪 Testing Authentication Functions...\n')
    
    // Connect to database
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    // Test data
    const testEmail = 'hottest12340@gmail.com'
    const testName = 'Test User'
    const testPassword = 'password123'

    // Clean up any existing test data
    await User.deleteOne({ email: testEmail })
    await EmailVerification.deleteOne({ email: testEmail })

    // Test 1: Email Verification Sending
    console.log('1️⃣ Testing Verification Email Sending...')
    const otp = generateOTP()
    console.log(`Generated OTP: ${otp}`)
    
    const emailResult = await sendVerificationEmailSmart(testEmail, otp, testName)
    console.log('📧 Email Result:', emailResult)
    
    if (emailResult.success) {
      console.log('✅ Verification email sent successfully!')
      console.log(`📬 Check ${testEmail} inbox for verification email`)
    } else {
      console.log('❌ Verification email failed:', emailResult.error)
    }
    console.log('---\n')

    // Test 2: Create User and Email Verification Record
    console.log('2️⃣ Testing User Creation...')
    
    const user = new User({
      name: testName,
      email: testEmail,
      password: testPassword, // Let the model hash it
      role: 'student',
      country: 'Nigeria',
      academicLevel: 'secondary',
      isEmailVerified: false
    })
    
    await user.save()
    console.log('✅ User created in database')
    
    // Create email verification record
    const verification = new EmailVerification({
      email: testEmail,
      otp: otp,
      userData: { name: testName, role: 'student', country: 'Nigeria' },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })
    
    await verification.save()
    console.log('✅ Email verification record created')
    console.log('---\n')

    // Test 3: Password Reset Email
    console.log('3️⃣ Testing Password Reset Email...')
    const resetOTP = generateOTP()
    console.log(`Generated Reset OTP: ${resetOTP}`)
    
    const resetEmailResult = await sendPasswordResetEmailSmart(testEmail, resetOTP, testName)
    console.log('🔑 Password Reset Email Result:', resetEmailResult)
    
    if (resetEmailResult.success) {
      console.log('✅ Password reset email sent successfully!')
      console.log(`📬 Check ${testEmail} inbox for password reset email`)
    } else {
      console.log('❌ Password reset email failed:', resetEmailResult.error)
    }
    console.log('---\n')

    // Test 4: Welcome Email (simulate verification)
    console.log('4️⃣ Testing Welcome Email...')
    
    const welcomeEmailResult = await sendWelcomeEmailSmart(testEmail, testName, 'student')
    console.log('🎉 Welcome Email Result:', welcomeEmailResult)
    
    if (welcomeEmailResult.success) {
      console.log('✅ Welcome email sent successfully!')
      console.log(`📬 Check ${testEmail} inbox for welcome email`)
    } else {
      console.log('❌ Welcome email failed:', welcomeEmailResult.error)
    }
    console.log('---\n')

    // Test 5: Database Operations
    console.log('5️⃣ Testing Database Operations...')
    
    // Find user (include password for testing)
    const foundUser = await User.findOne({ email: testEmail }).select('+password')
    console.log('👤 User found:', foundUser ? 'Yes' : 'No')
    
    // Find verification
    const foundVerification = await EmailVerification.findOne({ email: testEmail })
    console.log('📧 Verification record found:', foundVerification ? 'Yes' : 'No')
    
    if (foundVerification) {
      console.log('🔍 Verification OTP:', foundVerification.otp)
      console.log('⏰ Expires at:', foundVerification.expiresAt)
    }
    console.log('---\n')

    // Test 6: Password Verification
    console.log('6️⃣ Testing Password Verification...')
    
    if (foundUser) {
      // Use the User model's comparePassword method
      const passwordMatch = await foundUser.comparePassword(testPassword)
      console.log('🔐 Password verification:', passwordMatch ? 'Correct' : 'Incorrect')
    }
    console.log('---\n')

    console.log('🎉 All function tests completed!')
    console.log('\n📊 Test Summary:')
    console.log('✅ Email sending functions tested')
    console.log('✅ Database operations tested')
    console.log('✅ Password hashing tested')
    console.log('✅ OTP generation tested')
    console.log('✅ User creation tested')
    
    console.log('\n📧 Email Tests:')
    console.log(`- Verification email: ${emailResult.success ? 'SENT' : 'FAILED'}`)
    console.log(`- Password reset email: ${resetEmailResult.success ? 'SENT' : 'FAILED'}`)
    console.log(`- Welcome email: ${welcomeEmailResult.success ? 'SENT' : 'FAILED'}`)

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    await User.deleteOne({ email: testEmail })
    await EmailVerification.deleteOne({ email: testEmail })
    console.log('✅ Test data cleaned up')

    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')

  } catch (error) {
    console.error('❌ Test error:', error.message)
    console.error('Full error:', error)
  }
}

testAuthFunctions()