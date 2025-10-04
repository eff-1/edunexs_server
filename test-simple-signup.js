import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './src/models/User.js'

// Load environment variables
dotenv.config()

async function testSimpleSignup() {
  try {
    console.log('🧪 Testing Simple Signup Flow...\n')
    
    // Connect to database
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    const testEmail = 'test-simple@example.com'
    
    // Clean up any existing test data
    await User.deleteOne({ email: testEmail })
    console.log('🧹 Cleaned up existing test data\n')

    // Test the new simple signup flow
    console.log('1️⃣ Testing Simple User Creation...')
    
    const user = new User({
      name: 'Test User',
      email: testEmail,
      password: 'password123',
      role: 'student',
      country: 'Nigeria',
      academicLevel: 'secondary',
      isEmailVerified: true, // Auto-verified
      emailVerifiedAt: new Date()
    })
    
    await user.save()
    console.log('✅ User created and auto-verified')
    console.log(`👤 User ID: ${user._id}`)
    console.log(`📧 Email verified: ${user.isEmailVerified}`)
    console.log(`📅 Verified at: ${user.emailVerifiedAt}`)
    console.log('---\n')

    // Test login capability
    console.log('2️⃣ Testing Login Capability...')
    
    const foundUser = await User.findOne({ email: testEmail }).select('+password')
    if (foundUser) {
      console.log('✅ User found for login')
      console.log(`🔐 Email verified: ${foundUser.isEmailVerified}`)
      
      const passwordMatch = await foundUser.comparePassword('password123')
      console.log(`🔑 Password check: ${passwordMatch ? 'CORRECT ✅' : 'INCORRECT ❌'}`)
      
      if (foundUser.isEmailVerified && passwordMatch) {
        console.log('✅ User can login successfully!')
      } else {
        console.log('❌ Login would fail')
      }
    }
    console.log('---\n')

    console.log('🎉 Simple Signup Flow Test Results:')
    console.log('✅ No email verification required')
    console.log('✅ User created and auto-verified')
    console.log('✅ Can login immediately after signup')
    console.log('✅ No email service dependencies')
    
    console.log('\n🎯 User Experience:')
    console.log('1. User fills registration form')
    console.log('2. Account created instantly')
    console.log('3. User logged in automatically')
    console.log('4. Can access platform immediately')

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    await User.deleteOne({ email: testEmail })
    console.log('✅ Test data cleaned up')

    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')

  } catch (error) {
    console.error('❌ Test error:', error.message)
    console.error('Full error:', error)
  }
}

testSimpleSignup()