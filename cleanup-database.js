import mongoose from 'mongoose'
import User from './src/models/User.js'
import EmailVerification from './src/models/EmailVerification.js'
import dotenv from 'dotenv'

dotenv.config()

const cleanupDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('🧹 Cleaning up database...')

    // Delete all users
    const deletedUsers = await User.deleteMany({})
    console.log(`🗑️  Deleted ${deletedUsers.deletedCount} users`)

    // Delete all email verifications
    const deletedVerifications = await EmailVerification.deleteMany({})
    console.log(`🗑️  Deleted ${deletedVerifications.deletedCount} email verifications`)

    console.log('✅ Database cleanup complete!')
    console.log('📧 You can now reuse any email addresses for testing')

    process.exit(0)
  } catch (error) {
    console.error('❌ Cleanup error:', error)
    process.exit(1)
  }
}

cleanupDatabase()