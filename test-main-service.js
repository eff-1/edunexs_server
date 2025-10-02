import { sendVerificationEmail } from './src/services/emailService.js'

console.log('🧪 Testing Main Email Service...')

const testMainService = async () => {
  try {
    console.log('📧 Testing sendVerificationEmail function...')
    
    const result = await sendVerificationEmail(
      'ola411089@gmail.com', // your test email
      '123456', // test OTP
      'Test User' // test name
    )
    
    if (result.success) {
      console.log('✅ Main service works! Email sent successfully')
      console.log('📧 Message ID:', result.messageId)
    } else {
      console.log('❌ Main service failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Main service error:', error)
  }
}

testMainService()