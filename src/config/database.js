import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      console.log('📦 MongoDB already connected')
      return
    }

    // Check if MongoDB URI is properly configured
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.log('⚠️  MongoDB URI not configured properly')
      console.log('⚠️  Server will run without database connection')
      console.log('⚠️  Please update MONGODB_URI in your .env file')
      throw new Error('MongoDB URI not configured')
    }

    console.log('🔄 Attempting to connect to MongoDB...')
    
    // Configure mongoose for serverless
    mongoose.set('bufferCommands', false)
    mongoose.set('bufferMaxEntries', 0)
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds for faster timeout
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false,
      maxPoolSize: 10
    })

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`)
    console.log(`📦 Database: ${conn.connection.name}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('📦 MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('📦 MongoDB reconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('📦 MongoDB connection closed through app termination')
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.log('⚠️  Server will continue without database connection')
    console.log('⚠️  Please check your MongoDB configuration')
    
    // Log more details for debugging
    if (error.code) {
      console.log(`⚠️  Error code: ${error.code}`)
    }
    if (error.codeName) {
      console.log(`⚠️  Error name: ${error.codeName}`)
    }
  }
}

export default connectDB