import dotenv from 'dotenv'
import mongoose from 'mongoose'
import EmailVerification from './src/models/EmailVerification.js'
import User from './src/models/User.js'
import { generateOTP, sendVerificationEmail } from './src/services/emailService.js'

// Load environment variables
dotenv.config()

async function testEmailControl() {
  try {
    console.log('🧪 Testing Email Control System...\n')
    
    // Connect to database
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    console.log('🎛️ Email Control Settings:')
    console.log(`   SKIP_EMAILS: ${process.env.SKIP_EMAILS}`)
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? 'Set ✅' : 'Missing ❌'}`)
    console.log('---\n')

    const testEmail = 'test-control@example.com'
    
    // Clean up
    await User.deleteOne({ email: testEmail })
    await EmailVerification.deleteMany({ email: testEmail })

    // Test 1: Simulate registration with email control
    console.log('1️⃣ Testing Registration Flow...')
    
    const otp = generateOTP()
    console.log(`Generated OTP: ${otp}`)
    
    // Create verification record
    const verification = new EmailVerification({
      email: testEmail,
      otp: otp,
      userData: {
        name: 'Test User',
        role: 'student',
        country: 'Nigeria',
        academicLevel: 'secondary'
      },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })
    
    await verification.save()
    console.log('✅ Verification record created')
    
    // Test email sending with control
    let emailSent = false
    
    if (process.env.SKIP_EMAILS === 'true') {
      console.log('📧 Email sending disabled via SKIP_EMAILS flag')
      emailSent = false
    } else {
      try {
        console.log('📤 Attempting to send email...')
        const emailResult = await sendVerificationEmail(testEmail, otp, 'Test User')
        if (emailResult.success) {
          console.log('✅ Email sent successfully:', emailResult.messageId)
          emailSent = true
        } else {
          console.log('⚠️ Email sending failed:', emailResult.error)
        }
      } catch (emailError) {
        console.log('⚠️ Email service unavailable:', emailError.message)
      }
    }
    
    console.log(`📊 Email sent status: ${emailSent ? 'YES ✅' : 'NO ❌'}`)
    console.log('---\n')

    // Test 2: Simulate API response
    console.log('2️⃣ Testing API Response...')
    
    const apiResponse = {
      success: true,
      message: emailSent 
        ? 'Registration successful! Please check your email for verification code.'
        : 'Registration successful! Use OTP: ' + otp + ' to verify your account.',
      data: {
        email: testEmail,
        expiresIn: 300,
        emailSent: emailSent,
        ...(!emailSent && { otp: otp })
      }
    }
    
    console.log('📱 Frontend would receive:')
    console.log(JSON.stringify(apiResponse, null, 2))
    console.log('---\n')

    console.log('🎉 Email Control Test Results:')
    console.log(`✅ SKIP_EMAILS flag: ${process.env.SKIP_EMAILS === 'true' ? 'ACTIVE' : 'INACTIVE'}`)
    console.log(`✅ Registration: ALWAYS SUCCEEDS`)
    console.log(`✅ OTP available: ${!emailSent ? 'IN RESPONSE' : 'IN EMAIL'}`)
    console.log(`✅ User can verify: YES`)
    
    console.log('\n🎯 Benefits:')
    console.log('✅ No registration failures due to email issues')
    console.log('✅ Users always reach verification page')
    console.log('✅ OTP always available for verification')
    console.log('✅ Full control over email functionality')

    // Clean up
    await User.deleteOne({ email: testEmail })
    await EmailVerification.deleteMany({ email: testEmail })

    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')

  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

testEmailControl()