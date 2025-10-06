#!/usr/bin/env node

/**
 * WhatsApp Notification Checker
 * 
 * This script checks for pending tutor registration notifications
 * and can be used with WhatsApp bot services or manual checking.
 * 
 * Usage:
 * node whatsapp-checker.js
 */

import axios from 'axios'

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000'
const CHECK_INTERVAL = 30000 // Check every 30 seconds

async function checkNotifications() {
  try {
    console.log('🔍 Checking for new tutor registrations...')
    
    const response = await axios.get(`${SERVER_URL}/api/webhooks/notifications`)
    
    if (response.data.success && response.data.notifications.length > 0) {
      console.log(`📱 Found ${response.data.notifications.length} new notification(s)!`)
      
      for (const notification of response.data.notifications) {
        console.log('\n' + '='.repeat(50))
        console.log('🎓 NEW TUTOR REGISTRATION')
        console.log('='.repeat(50))
        console.log(notification.message)
        console.log('='.repeat(50))
        
        // Here you could integrate with WhatsApp API
        // For now, we'll just display the message
        
        // Mark as sent (optional)
        try {
          await axios.put(`${SERVER_URL}/api/webhooks/notifications/${notification.id}/sent`)
          console.log('✅ Notification marked as sent')
        } catch (error) {
          console.log('⚠️ Could not mark notification as sent')
        }
      }
    } else {
      console.log('✅ No new notifications')
    }
  } catch (error) {
    console.error('❌ Error checking notifications:', error.message)
  }
}

// Check immediately
checkNotifications()

// Set up interval checking
setInterval(checkNotifications, CHECK_INTERVAL)

console.log(`🤖 WhatsApp notification checker started`)
console.log(`📡 Server: ${SERVER_URL}`)
console.log(`⏰ Checking every ${CHECK_INTERVAL/1000} seconds`)
console.log('Press Ctrl+C to stop')