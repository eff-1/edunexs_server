import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected for migration')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Fix legacy users
const fixLegacyUsers = async () => {
  try {
    console.log('🔧 Starting legacy user data migration...')
    
    // Update users where qualifications is a string
    const result1 = await mongoose.connection.db.collection('users').updateMany(
      { qualifications: { $type: "string" } },
      { $set: { qualifications: [] } }
    )
    
    console.log(`✅ Fixed ${result1.modifiedCount} users with string qualifications`)
    
    // Update users where subjects is not an array or doesn't exist
    const result2 = await mongoose.connection.db.collection('users').updateMany(
      { $or: [
        { subjects: { $not: { $type: "array" } } },
        { subjects: { $exists: false } }
      ]},
      { $set: { subjects: [] } }
    )
    
    console.log(`✅ Fixed ${result2.modifiedCount} users with invalid subjects`)
    
    // Update users where tutorProfile doesn't exist for tutors
    const result3 = await mongoose.connection.db.collection('users').updateMany(
      { 
        role: 'tutor',
        tutorProfile: { $exists: false }
      },
      { 
        $set: { 
          tutorProfile: {
            hourlyRate: 0,
            availability: [],
            languages: [],
            teachingStyle: '',
            bio: '',
            verified: false,
            rating: 0,
            totalRatings: 0,
            studentsCount: 0,
            sessionsCompleted: 0
          }
        } 
      }
    )
    
    console.log(`✅ Fixed ${result3.modifiedCount} tutors with missing tutorProfile`)
    
    console.log('🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('📝 Database connection closed')
  }
}

// Run migration
const runMigration = async () => {
  await connectDB()
  await fixLegacyUsers()
}

runMigration()