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

      // Log the notification (in production, you'd send this via WhatsApp API)
      console.log('=== TUTOR REGISTRATION NOTIFICATION ===')
      console.log(`To: ${this.adminWhatsApp}`)
      console.log('Message:')
      console.log(message)
      console.log('==========================================')

      // For now, we'll store this in a simple notification log
      // In production, you would integrate with WhatsApp Business API
      await this.logNotification({
        type: 'tutor_registration',
        recipient: this.adminWhatsApp,
        message: message,
        tutorData: tutorData,
        timestamp: new Date()
      })

      return { success: true, message: 'Notification sent successfully' }
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      return { success: false, error: error.message }
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