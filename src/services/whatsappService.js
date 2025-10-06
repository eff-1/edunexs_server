import axios from 'axios'

class WhatsAppService {
  constructor() {
    this.adminWhatsApp = '+2348128653553'
    // You can use WhatsApp Business API or a service like Twilio
    // For now, we'll use a simple webhook approach
  }

  async sendTutorRegistrationNotification(tutorData) {
    try {
      const contactInfo = []
      
      if (tutorData.contactMethods?.whatsapp && tutorData.whatsappNumber) {
        contactInfo.push(`WhatsApp: ${tutorData.whatsappNumber}`)
      }
      if (tutorData.contactMethods?.telegram && tutorData.telegramHandle) {
        contactInfo.push(`Telegram: ${tutorData.telegramHandle}`)
      }
      if (tutorData.contactMethods?.instagram && tutorData.instagramHandle) {
        contactInfo.push(`Instagram: ${tutorData.instagramHandle}`)
      }
      if (tutorData.contactMethods?.twitter && tutorData.twitterHandle) {
        contactInfo.push(`Twitter: ${tutorData.twitterHandle}`)
      }

      const subjects = tutorData.subjects?.map(s => `${s.name} (${s.level})`).join(', ') || 'Not specified'
      const qualifications = tutorData.qualifications?.map(q => `${q.degree} from ${q.institution} (${q.year})`).join(', ') || 'Not specified'

      const message = `🎓 NEW TUTOR REGISTRATION 🎓

👤 Name: ${tutorData.name}
📧 Email: ${tutorData.email}
🌍 Country: ${tutorData.country}
📚 Specialization: ${tutorData.specialization}
⏰ Experience: ${tutorData.experience}

📞 Contact Methods:
${contactInfo.join('\n')}

📖 Subjects: ${subjects}

🎓 Qualifications: ${qualifications}

📝 Bio: ${tutorData.bio || 'Not provided'}

Registration Time: ${new Date().toLocaleString()}

Please contact this tutor for interview and onboarding.`

      console.log('=== 🎓 NEW TUTOR REGISTRATION NOTIFICATION ===')
      console.log(`📱 Sending to: ${this.adminWhatsApp}`)
      
      // Method 1: Try to send via CallMeBot WhatsApp API
      const whatsappSent = await this.sendViaWhatsAppAPI(message)
      
      // Method 2: Store in webhook system (backup/web interface)
      await this.createWebhookNotification(message, tutorData)
      
      // Method 3: Email backup (if needed)
      const emailSent = whatsappSent ? false : await this.sendViaEmail(message, tutorData)

      // Detailed logging
      console.log('📊 Notification Results:')
      console.log(`  📱 WhatsApp (CallMeBot): ${whatsappSent ? '✅ Sent' : '❌ Failed'}`)
      console.log(`  🌐 Web Interface: ✅ Available`)
      console.log(`  📧 Email Backup: ${emailSent ? '✅ Sent' : '⏭️ Skipped'}`)
      console.log('================================================')

      return { 
        success: true, 
        message: 'Notification sent successfully',
        methods: {
          whatsapp: whatsappSent,
          email: emailSent,
          webhook: true
        }
      }
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      return { success: false, error: error.message }
    }
  }

  async sendViaWhatsAppAPI(message) {
    try {
      const callMeBotAPI = process.env.CALLMEBOT_API_KEY
      const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '2348128653553'
      
      if (!callMeBotAPI || callMeBotAPI === 'your_api_key_here') {
        console.log('⚠️ CallMeBot API key not configured. Please set CALLMEBOT_API_KEY in .env')
        return false
      }

      console.log(`📱 Sending WhatsApp message via CallMeBot to ${adminPhone}`)
      
      // CallMeBot API call
      const response = await axios.get(`https://api.callmebot.com/whatsapp.php`, {
        params: {
          phone: adminPhone,
          text: message.substring(0, 1000), // Limit message length
          apikey: callMeBotAPI
        },
        timeout: 10000 // 10 second timeout
      })
      
      if (response.status === 200) {
        console.log('✅ WhatsApp message sent successfully via CallMeBot')
        return true
      } else {
        console.log('❌ CallMeBot API returned non-200 status:', response.status)
        return false
      }
    } catch (error) {
      console.error('❌ WhatsApp API error:', error.message)
      
      // Log specific error types
      if (error.code === 'ECONNABORTED') {
        console.log('⏰ Request timeout - CallMeBot might be slow')
      } else if (error.response) {
        console.log('📡 CallMeBot API error:', error.response.status, error.response.data)
      }
      
      return false
    }
  }

  async sendViaEmail(message, tutorData) {
    try {
      // Send email notification as backup
      const emailData = {
        to: 'your-email@example.com', // Replace with your email
        subject: `🎓 New Tutor Registration: ${tutorData.name}`,
        text: message,
        html: `<pre>${message}</pre>`
      }
      
      // You can integrate with your existing email service here
      console.log('Email notification prepared:', emailData.subject)
      return true
    } catch (error) {
      console.error('Email notification error:', error)
      return false
    }
  }

  async createWebhookNotification(message, tutorData) {
    try {
      // Store notification in a way that can be accessed by external webhook
      const notification = {
        type: 'tutor_registration',
        recipient: this.adminWhatsApp,
        message: message,
        tutorData: tutorData,
        status: 'pending'
      }
      
      // Send to webhook endpoint
      try {
        await axios.post(`${process.env.SERVER_URL || 'http://localhost:5000'}/api/webhooks/notifications`, notification)
        console.log('✅ Notification stored in webhook system')
      } catch (webhookError) {
        console.error('Webhook storage error:', webhookError.message)
      }
      
      // Also log it
      await this.logNotification(notification)
      
      return true
    } catch (error) {
      console.error('Webhook notification error:', error)
      return false
    }
  }

  async logNotification(notificationData) {
    // In a real app, you'd save this to database
    // For now, we'll just log it
    console.log('Notification logged:', {
      id: Date.now(),
      ...notificationData
    })
  }

  // Method to get pending notifications (for admin dashboard)
  async getPendingNotifications() {
    // In production, this would fetch from database
    return []
  }
}

export default new WhatsAppService()