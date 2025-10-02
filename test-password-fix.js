import mongoose from 'mongoose'
import User from './src/models/User.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const testPasswordFix = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clean up first
    await User.deleteMany({})
    console.log('🧹 Cleaned existing users')

    // Test password hashing
    const testPassword = 'password123'
    console.log(`\n🧪 Testing password: "${testPassword}"`)

    // Create user (should use model's pre-save hook)
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: testPassword,
      role: 'student',
      country: 'Nigeria',
      academicLevel: 'undergraduate',
      isEmailVerified: true
    })

    await user.save()
    console.log('✅ User created with model pre-save hook')

    // Fetch user with password
    const savedUser = await User.findOne({ email: 'test@example.com' }).select('+password')
    console.log('📋 Saved user password hash:', savedUser.password.substring(0, 20) + '...')

    // Test password comparison
    const isMatch = await bcrypt.compare(testPassword, savedUser.password)
    console.log(`🔐 Password "${testPassword}" matches: ${isMatch ? '✅ YES' : '❌ NO'}`)

    if (isMatch) {
      console.log('\n🎉 PASSWORD HASHING FIXED!')
      console.log('✅ Single hashing (model pre-save hook only)')
      console.log('✅ Login should work now')
    } else {
      console.log('\n❌ Password hashing still broken')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Test error:', error)
    process.exit(1)
  }
}

testPasswordFix()