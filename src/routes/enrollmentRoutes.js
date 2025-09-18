import express from 'express'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// @desc    Enroll in course
// @route   POST /api/enrollments/:courseId
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Enrollment endpoint working',
      data: { courseId: req.params.courseId, userId: req.user._id }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private
const getUserEnrollments = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'User enrollments endpoint working',
      data: []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Routes
router.post('/:courseId', protect, enrollInCourse)
router.get('/', protect, getUserEnrollments)

export default router