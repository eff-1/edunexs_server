import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB