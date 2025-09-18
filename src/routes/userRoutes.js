import express from 'express'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Users endpoint working',
      data: []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'User profile endpoint working',
      data: req.user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Routes
router.get('/', protect, authorize('admin'), getUsers)
router.get('/profile', protect, getUserProfile)

export default router