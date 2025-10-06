#!/usr/bin/env node

/**
 * Test WhatsApp CallMeBot API
 * This script tests if your CallMeBot setup is working
 */

import axios from 'axios'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testWhatsApp() {
  const apiKey = process.env.CALLMEBOT_API_KEY
  const phone = process.env.ADMIN_WHATSAPP_NUMBER
  
  console.log('🧪 Testing CallMeBot WhatsApp API...')
  console.log(`📱 Phone: +${phone}`)
  console.log(`🔑 API Key: ${apiKey}`)
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('❌ API key not configured!')
    return
  }
  
  const testMessage = `🎓 TEST MESSAGE FROM EDUNEXS

This is a test message to verify your WhatsApp notifications are working!

✅ CallMeBot API: Connected
📱 Phone: +${phone}
🔑 API Key: ${apiKey}
⏰ Time: ${new Date().toLocaleString()}

If you receive this message, your tutor notifications will work perfectly! 🎉`

  try {
    console.log('📤 Sending test message...')
    
    const response = await axios.get('https://api.callmebot.com/whatsapp.php', {
      params: {
        phone: phone,
        text: testMessage,
        apikey: apiKey
      },
      timeout: 15000
    })
    
    if (response.status === 200) {
      console.log('✅ SUCCESS! Test message sent to WhatsApp')
      console.log('📱 Check your WhatsApp - you should receive the test message')
      console.log('🎉 Your tutor notifications are now fully configured!')
    } else {
      console.log('❌ API returned status:', response.status)
    }
    
  } catch (error) {
    console.log('❌ Error sending test message:')
    console.log('   ', error.message)
    
    if (error.response) {
      console.log('   API Response:', error.response.status, error.response.data)
    }
  }
}

// Run the test
testWhatsApp()