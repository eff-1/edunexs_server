import mongoose from 'mongoose'

// Database connection middleware for serverless environments
export const ensureDBConnection = async (req, res, next) => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState === 1) {
      return next()
    }

    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.error('❌ MongoDB URI not configured properly')
      return res.status(500).json({
        success: false,
        message: 'Database configuration error'
      })
    }

    console.log('🔄 Connecting to MongoDB...')
    
    // Configure mongoose for serverless
    mongoose.set('bufferCommands', false)
    mongoose.set('bufferMaxEntries', 0)
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10
    })

    console.log('✅ MongoDB connected successfully')
    next()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    })
  }
}

export default ensureDBConnection