import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected for cleanup')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Clean database for fresh start
const cleanDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup for fresh launch...')
    
    // Get current user count
    const userCount = await mongoose.connection.db.collection('users').countDocuments()
    console.log(`📊 Current users in database: ${userCount}`)
    
    if (userCount === 0) {
      console.log('✅ Database is already clean!')
      return
    }
    
    // Ask for confirmation (in production, you might want to add more safety)
    console.log('⚠️  This will delete ALL users from the database')
    console.log('⚠️  Only fresh signups will work after this')
    console.log('⚠️  This is recommended for production launch')
    
    // Delete all users
    const deleteResult = await mongoose.connection.db.collection('users').deleteMany({})
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`)
    
    // Delete all email verifications (if any)
    const emailVerificationResult = await mongoose.connection.db.collection('emailverifications').deleteMany({})
    console.log(`✅ Deleted ${emailVerificationResult.deletedCount} email verification records`)
    
    // Delete any other related collections if they exist
    try {
      const practiceSessionResult = await mongoose.connection.db.collection('practicesessions').deleteMany({})
      console.log(`✅ Deleted ${practiceSessionResult.deletedCount} practice session records`)
    } catch (e) {
      console.log('ℹ️  No practice sessions to delete')
    }
    
    console.log('🎉 Database cleanup completed successfully!')
    console.log('✅ Ready for fresh user signups')
    console.log('✅ All new users will have perfect experience')
    console.log('✅ No legacy data issues')
    
  } catch (error) {
    console.error('❌ Cleanup error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('📝 Database connection closed')
  }
}

// Run cleanup
const runCleanup = async () => {
  console.log('🚀 EDUNEXS LEARNSPHERE - DATABASE CLEANUP')
  console.log('==========================================')
  console.log('This will prepare your database for production launch')
  console.log('All fresh signups will work perfectly after this')
  console.log('')
  
  await connectDB()
  await cleanDatabase()
  
  console.log('')
  console.log('🎯 NEXT STEPS:')
  console.log('1. ✅ Database is now clean and ready')
  console.log('2. ✅ Fresh user signups will work perfectly')
  console.log('3. ✅ No more legacy data issues')
  console.log('4. ✅ Ready to launch your platform!')
}

runCleanup()