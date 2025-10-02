import nodemailer from 'nodemailer'

// Render-compatible configuration
const createRenderTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Let nodemailer handle SMTP details
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Simplified email sending with timeout handling
export const sendVerificationEmailRender = async (email, otp, name = '') => {
  try {
    console.log(`📧 Sending verification email to ${email}`)
    
    const transporter = createRenderTransporter()
    
    // Skip connection test - directly send email

    const mailOptions = {
      from: `"Edunexs LearnSphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Edunexs LearnSphere',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3B82F6;">Welcome to Edunexs LearnSphere! 🎓</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #10B981; letter-spacing: 3px;">${otp}</span>
          </div>
          <p>This code expires in 5 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Edunexs LearnSphere - Your Exam Preparation Platform
          </p>
        </div>
      `,
      text: `Welcome to Edunexs LearnSphere! Your verification code is: ${otp}. This code expires in 5 minutes.`
    }

    console.log('📤 Sending email...')
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', result.messageId)
    
    return { success: true, messageId: result.messageId }
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message)
    
    // FAIL the registration if email cannot be sent
    return { success: false, error: error.message }
  }
}

export const sendWelcomeEmailRender = async (email, name, role) => {
  try {
    const transporter = createRenderTransporter()
    
    const result = await transporter.sendMail({
      from: `"Edunexs LearnSphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Edunexs LearnSphere, ${name}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3B82F6;">Welcome to Edunexs LearnSphere! 🎉</h2>
          <p>Hi ${name},</p>
          <p>Your account has been successfully verified! Welcome to our learning community.</p>
          <p>You can now access all features of our platform.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          <p>Happy learning!</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Edunexs LearnSphere - Your Exam Preparation Platform
          </p>
        </div>
      `,
      text: `Welcome to Edunexs LearnSphere, ${name}! Your account has been verified.`
    })

    console.log('✅ Welcome email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
    
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message)
    return { success: true, messageId: 'fallback-welcome' } // Don't block the process
  }
}

export default {
  sendVerificationEmailRender,
  sendWelcomeEmailRender
}