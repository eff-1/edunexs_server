import mongoose from 'mongoose'
import User from './src/models/User.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const debugLogin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // List all users
    console.log('\n📋 All users in database:')
    const users = await User.find({}).select('+password')
    
    if (users.length === 0) {
      console.log('❌ No users found in database')
      return
    }

    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Email Verified: ${user.isEmailVerified}`)
      console.log(`   Active: ${user.isActive}`)
      console.log(`   Password Hash: ${user.password ? 'EXISTS' : 'MISSING'}`)
      console.log(`   Created: ${user.createdAt}`)
    })

    // Test password comparison for first user
    if (users.length > 0) {
      const testUser = users[0]
      console.log(`\n🔐 Testing password for ${testUser.email}:`)
      
      // Test with common passwords
      const testPasswords = ['password123', 'Password123', '123456', 'password']
      
      for (const testPass of testPasswords) {
        try {
          const isMatch = await bcrypt.compare(testPass, testUser.password)
          console.log(`   "${testPass}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`)
        } catch (error) {
          console.log(`   "${testPass}": ❌ ERROR - ${error.message}`)
        }
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Debug error:', error)
    process.exit(1)
  }
}

debugLogin()