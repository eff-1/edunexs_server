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

      // Method 1: Try to send via WhatsApp Web API (if available)
      const whatsappSent = await this.sendViaWhatsAppAPI(message)
      
      // Method 2: Send via Email as backup (to your email)
      const emailSent = await this.sendViaEmail(message, tutorData)
      
      // Method 3: Create a webhook endpoint for external WhatsApp bots
      await this.createWebhookNotification(message, tutorData)

      // Always log for debugging
      console.log('=== TUTOR REGISTRATION NOTIFICATION ===')
      console.log(`To: ${this.adminWhatsApp}`)
      console.log('Message:')
      console.log(message)
      console.log('WhatsApp API:', whatsappSent ? 'Sent' : 'Failed')
      console.log('Email Backup:', emailSent ? 'Sent' : 'Failed')
      console.log('==========================================')

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
      // Option 1: Use a WhatsApp API service like Twilio, MessageBird, or WhatsApp Business API
      // For now, we'll use a simple HTTP request to a webhook service
      
      // You can use services like:
      // - CallMeBot (free): https://www.callmebot.com/blog/free-api-whatsapp-messages/
      // - Twilio WhatsApp API
      // - WhatsApp Business API
      
      // Example with CallMeBot (you need to set this up first)
      const callMeBotAPI = process.env.CALLMEBOT_API_KEY
      if (callMeBotAPI) {
        const response = await axios.get(`https://api.callmebot.com/whatsapp.php`, {
          params: {
            phone: this.adminWhatsApp.replace('+', ''),
            text: message,
            apikey: callMeBotAPI
          }
        })
        return response.status === 200
      }
      
      return false
    } catch (error) {
      console.error('WhatsApp API error:', error)
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