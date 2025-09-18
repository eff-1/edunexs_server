import express from 'express'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Courses endpoint working',
      data: []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Single course endpoint working',
      data: { id: req.params.id }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Routes
router.get('/', getCourses)
router.get('/:id', getCourse)

export default router