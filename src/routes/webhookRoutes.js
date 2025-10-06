import express from 'express'

const router = express.Router()

// Store pending notifications (in production, use database)
let pendingNotifications = []

// Webhook endpoint to get pending notifications
router.get('/notifications', (req, res) => {
  try {
    const notifications = [...pendingNotifications]
    // Clear notifications after sending
    pendingNotifications = []
    
    res.json({
      success: true,
      notifications: notifications,
      count: notifications.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Endpoint to add notification (used by WhatsApp service)
router.post('/notifications', (req, res) => {
  try {
    const notification = {
      id: Date.now(),
      ...req.body,
      timestamp: new Date()
    }
    
    pendingNotifications.push(notification)
    
    res.json({
      success: true,
      message: 'Notification added',
      id: notification.id
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Endpoint to mark notification as sent
router.put('/notifications/:id/sent', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id)
    const index = pendingNotifications.findIndex(n => n.id === notificationId)
    
    if (index !== -1) {
      pendingNotifications[index].status = 'sent'
      pendingNotifications[index].sentAt = new Date()
    }
    
    res.json({
      success: true,
      message: 'Notification marked as sent'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router