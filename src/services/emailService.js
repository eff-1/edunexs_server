import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send verification email
export const sendVerificationEmail = async (email, otp, name = '') => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: {
        name: 'Edunexs LearnSphere',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Verify Your Email - Edunexs LearnSphere',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5, #14B8A6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #4F46E5; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Edunexs LearnSphere</h1>
              <p>Welcome to Your Exam Success Journey!</p>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}! 👋</h2>
              <p>Thank you for joining Edunexs LearnSphere! To complete your registration and start your exam preparation journey, please verify your email address.</p>
              
              <div class="otp-box">
                <h3>Your Verification Code</h3>
                <div class="otp-code">${otp}</div>
                <p><strong>This code expires in 5 minutes</strong></p>
              </div>
              
              <p>Enter this code on the verification page to activate your account and access:</p>
              <ul>
                <li>✅ Comprehensive CBT practice sessions</li>
                <li>📊 Real-time performance analytics</li>
                <li>👨‍🏫 Expert tutor connections</li>
                <li>🎯 Personalized study plans</li>
              </ul>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <div class="footer">
                <p>Need help? Contact us at <a href="mailto:support@edunexs.com">support@edunexs.com</a></p>
                <p>© 2024 Edunexs LearnSphere. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Edunexs LearnSphere!
        
        Your verification code is: ${otp}
        
        This code expires in 5 minutes. Enter it on the verification page to complete your registration.
        
        If you didn't create an account with us, please ignore this email.
        
        Need help? Contact us at support@edunexs.com
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Verification email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Failed to send verification email:', error)
    return { success: false, error: error.message }
  }
}

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, name, role) => {
  try {
    const transporter = createTransporter()

    const roleSpecificContent = role === 'tutor' 
      ? {
          title: 'Welcome to the Edunexs Tutor Community! 👨‍🏫',
          content: `
            <p>Congratulations on joining our elite team of tutors! You're now part of a community dedicated to helping students achieve their academic dreams.</p>
            <h3>What's Next?</h3>
            <ul>
              <li>🎯 Complete your tutor profile</li>
              <li>📚 Set your subject specializations</li>
              <li>💬 Connect with students who need your expertise</li>
              <li>📞 Contact our HR team for full hiring opportunities</li>
            </ul>
            <p>Ready to make a difference? <a href="${process.env.CLIENT_URL}/tutor-dashboard" class="button">Access Your Tutor Dashboard</a></p>
          `
        }
      : {
          title: 'Welcome to Your Exam Success Journey! 🎓',
          content: `
            <p>You're now part of thousands of students who have chosen Edunexs LearnSphere to ace their exams!</p>
            <h3>Get Started:</h3>
            <ul>
              <li>🎯 Take your first CBT practice test</li>
              <li>📊 Track your progress with detailed analytics</li>
              <li>👨‍🏫 Connect with expert tutors when you need help</li>
              <li>🏆 Join study groups and compete with peers</li>
            </ul>
            <p>Ready to start practicing? <a href="${process.env.CLIENT_URL}/practice" class="button">Start Your First Practice</a></p>
          `
        }

    const mailOptions = {
      from: {
        name: 'Edunexs LearnSphere',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `Welcome to Edunexs LearnSphere, ${name}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Edunexs LearnSphere</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5, #14B8A6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ${roleSpecificContent.title}</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              ${roleSpecificContent.content}
              
              <p>If you have any questions, our support team is here to help!</p>
              
              <div class="footer">
                <p>Contact us: <a href="mailto:support@edunexs.com">support@edunexs.com</a> | <a href="https://wa.me/2348128653553">WhatsApp Support</a></p>
                <p>© 2024 Edunexs LearnSphere. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Welcome email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
    return { success: false, error: error.message }
  }
}

export default {
  generateOTP,
  sendVerificationEmail,
  sendWelcomeEmail
}

// Send password reset email
export const sendPasswordResetEmail = async (email, otp, name) => {
  try {
    console.log(`📧 Sending password reset email to ${email}`)

    const mailOptions = {
      from: {
        name: 'Edunexs LearnSphere',
        address: process.env.EMAIL_FROM
      },
      to: email,
      subject: 'Reset Your Password - Edunexs LearnSphere',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0; font-size: 28px;">🎓 Edunexs LearnSphere</h1>
              <p style="color: #6B7280; margin: 10px 0 0 0;">Your Exam Preparation Platform</p>
            </div>
            
            <h2 style="color: #1F2937; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name}, we received a request to reset your password. Use the code below to set a new password:</p>
            
            <div style="background: linear-gradient(135deg, #EF4444, #DC2626); padding: 25px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">Your Reset Code</p>
              <div style="background: white; display: inline-block; padding: 15px 25px; border-radius: 6px; margin: 10px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #DC2626; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</span>
              </div>
              <p style="color: #FEE2E2; margin: 10px 0 0 0; font-size: 12px;">This code expires in 5 minutes</p>
            </div>
            
            <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400E; margin: 0; font-size: 14px;">⚠️ <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">Need help? Contact us at support@edunexs.com</p>
              <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">© 2024 Edunexs LearnSphere. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
      text: `Password Reset - Edunexs LearnSphere. Hi ${name}, use this code to reset your password: ${otp}. This code expires in 5 minutes. If you didn't request this, please ignore this email.`
    }

    const transporter = createTransporter()
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset email sent:', info.messageId)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Password reset email failed:', error.message)
    return { success: false, error: error.message }
  }
}