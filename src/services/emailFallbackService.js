import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from './emailService.js'
import { sendVerificationEmailResend, sendWelcomeEmailResend, sendPasswordResetEmailResend } from './resendService.js'

// Smart email service with fallback
export const sendVerificationEmailSmart = async (email, otp, name = '') => {
  try {
    console.log('📧 Attempting to send verification email via Resend...')
    
    // Try Resend first (best deliverability)
    const resendResult = await sendVerificationEmailResend(email, otp, name)
    
    if (resendResult.success) {
      console.log('✅ Email sent via Resend (99% inbox rate)')
      return resendResult
    }
    
    // If Resend fails (quota exceeded), fallback to Gmail
    console.log('⚠️ Resend failed, falling back to Gmail SMTP...')
    const gmailResult = await sendVerificationEmail(email, otp, name)
    
    if (gmailResult.success) {
      console.log('✅ Email sent via Gmail SMTP (fallback)')
      return gmailResult
    }
    
    return { success: false, error: 'Both email services failed' }
    
  } catch (error) {
    console.error('❌ Smart email service error:', error.message)
    return { success: false, error: error.message }
  }
}

export const sendWelcomeEmailSmart = async (email, name, role) => {
  try {
    console.log('📧 Attempting to send welcome email via Resend...')
    
    // Try Resend first (best deliverability)
    const resendResult = await sendWelcomeEmailResend(email, name, role)
    
    if (resendResult.success) {
      console.log('✅ Welcome email sent via Resend (99% inbox rate)')
      return resendResult
    }
    
    // If Resend fails (quota exceeded), fallback to Gmail
    console.log('⚠️ Resend failed, falling back to Gmail SMTP...')
    const gmailResult = await sendWelcomeEmail(email, name, role)
    
    if (gmailResult.success) {
      console.log('✅ Welcome email sent via Gmail SMTP (fallback)')
      return gmailResult
    }
    
    return { success: false, error: 'Both email services failed' }
    
  } catch (error) {
    console.error('❌ Smart welcome email service error:', error.message)
    return { success: false, error: error.message }
  }
}

export const sendPasswordResetEmailSmart = async (email, otp, name) => {
  try {
    console.log('📧 Attempting to send password reset email via Resend...')
    
    // Try Resend first (best deliverability)
    const resendResult = await sendPasswordResetEmailResend(email, otp, name)
    
    if (resendResult.success) {
      console.log('✅ Password reset email sent via Resend (99% inbox rate)')
      return resendResult
    }
    
    // If Resend fails (quota exceeded), fallback to Gmail
    console.log('⚠️ Resend failed, falling back to Gmail SMTP...')
    const gmailResult = await sendPasswordResetEmail(email, otp, name)
    
    if (gmailResult.success) {
      console.log('✅ Password reset email sent via Gmail SMTP (fallback)')
      return gmailResult
    }
    
    return { success: false, error: 'Both email services failed' }
    
  } catch (error) {
    console.error('❌ Smart password reset email service error:', error.message)
    return { success: false, error: error.message }
  }
}

export default {
  sendVerificationEmailSmart,
  sendWelcomeEmailSmart,
  sendPasswordResetEmailSmart
}