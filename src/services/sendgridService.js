import sgMail from '@sendgrid/mail'

// Initialize SendGrid - API key will be set in each function

// SendGrid email service - works on all hosting platforms
export const sendVerificationEmailSendGrid = async (email, otp, name = '') => {
  try {
    // Set API key for this request
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    console.log(`📧 Sending verification email via SendGrid to ${email}`)
    
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER,
        name: 'Edunexs LearnSphere'
      },
      subject: 'Verify Your Email - Edunexs LearnSphere',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0; font-size: 28px;">🎓 Edunexs LearnSphere</h1>
              <p style="color: #6B7280; margin: 10px 0 0 0;">Your Exam Preparation Platform</p>
            </div>
            
            <h2 style="color: #1F2937; margin-bottom: 20px;">Welcome ${name || 'to our platform'}! 🎉</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for joining Edunexs LearnSphere. To complete your registration, please verify your email address using the code below:</p>
            
            <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 25px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">Your Verification Code</p>
              <div style="background: white; display: inline-block; padding: 15px 25px; border-radius: 6px; margin: 10px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #10B981; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</span>
              </div>
              <p style="color: #E5E7EB; margin: 10px 0 0 0; font-size: 12px;">This code expires in 5 minutes</p>
            </div>
            
            <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400E; margin: 0; font-size: 14px;">⚠️ <strong>Important:</strong> If you didn't create an account with us, please ignore this email.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">Need help? Contact us at support@edunexs.com</p>
              <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">© 2024 Edunexs LearnSphere. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
      text: `Welcome to Edunexs LearnSphere! Your verification code is: ${otp}. This code expires in 5 minutes. If you didn't create an account, please ignore this email.`
    }

    const result = await sgMail.send(msg)
    console.log('✅ SendGrid email sent successfully:', result[0].statusCode)
    
    return { 
      success: true, 
      messageId: result[0].headers['x-message-id'] || 'sendgrid-' + Date.now()
    }
    
  } catch (error) {
    console.error('❌ SendGrid email failed:', error.message)
    if (error.response) {
      console.error('SendGrid error details:', error.response.body)
    }
    return { success: false, error: error.message }
  }
}

export const sendWelcomeEmailSendGrid = async (email, name, role) => {
  try {
    console.log(`📧 Sending welcome email via SendGrid to ${email}`)
    
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER,
        name: 'Edunexs LearnSphere'
      },
      subject: `Welcome to Edunexs LearnSphere, ${name}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0; font-size: 28px;">🎓 Edunexs LearnSphere</h1>
              <p style="color: #6B7280; margin: 10px 0 0 0;">Your Exam Preparation Platform</p>
            </div>
            
            <h2 style="color: #1F2937; margin-bottom: 20px;">Welcome to the community, ${name}! 🎉</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Congratulations! Your email has been successfully verified and your account is now active.</p>
            
            <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 25px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <h3 style="color: white; margin: 0 0 15px 0;">🚀 You're all set!</h3>
              <p style="color: #D1FAE5; margin: 0 0 20px 0; font-size: 14px;">Start your exam preparation journey now</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: white; color: #059669; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Access Your Dashboard</a>
            </div>
            
            <div style="background-color: #EFF6FF; border: 1px solid #3B82F6; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #1E40AF; margin: 0 0 10px 0;">What's next?</h4>
              <ul style="color: #1F2937; margin: 0; padding-left: 20px;">
                ${role === 'student' ? `
                  <li>Browse available practice tests</li>
                  <li>Set your exam preparation goals</li>
                  <li>Connect with expert tutors</li>
                  <li>Track your progress</li>
                ` : `
                  <li>Complete your tutor profile</li>
                  <li>Set your availability</li>
                  <li>Connect with students</li>
                  <li>Start earning by teaching</li>
                `}
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">Need help getting started? Contact us at support@edunexs.com</p>
              <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">© 2024 Edunexs LearnSphere. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
      text: `Welcome to Edunexs LearnSphere, ${name}! Your account has been verified successfully. Visit ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard to get started.`
    }

    const result = await sgMail.send(msg)
    console.log('✅ SendGrid welcome email sent:', result[0].statusCode)
    
    return { 
      success: true, 
      messageId: result[0].headers['x-message-id'] || 'sendgrid-welcome-' + Date.now()
    }
    
  } catch (error) {
    console.error('❌ SendGrid welcome email failed:', error.message)
    return { success: false, error: error.message }
  }
}

export default {
  sendVerificationEmailSendGrid,
  sendWelcomeEmailSendGrid
}