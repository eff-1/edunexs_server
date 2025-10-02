import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

// Import configurations and middleware
import connectDB from './config/database.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import { setupSocketHandlers } from './sockets/socketHandlers.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import userRoutes from './routes/userRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import practiceRoutes from './routes/practiceRoutes.js'

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

// Create Express app
const app = express()

// Configure trust proxy for Vercel deployment
app.set('trust proxy', 1)

const server = createServer(app)

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Setup socket handlers
setupSocketHandlers(io)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Edunexs LearnSphere API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes 
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/users', userRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/practice', practiceRoutes)

// src/server.js 
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Edunexs LearnSphere API is running 🚀",
  });
});


// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Edunexs LearnSphere server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`)
})