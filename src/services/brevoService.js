import fetch from 'node-fetch'

// Brevo email service - works without domain verification
export const sendVerificationEmailBrevo = async (email, otp, name = '') => {
  try {
    console.log(`📧 Sending verification email via Brevo to ${email}`)
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: 'Edunexs LearnSphere',
          email: 'noreply@edunexs-platform.com'
        },
        to: [{
          email: email,
          name: name || 'User'
        }],
        subject: 'Verify Your Email - Edunexs LearnSphere',
        htmlContent: `
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
        textContent: `Welcome to Edunexs LearnSphere! Your verification code is: ${otp}. This code expires in 5 minutes.`
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Brevo email sent successfully:', result.messageId)
      return { 
        success: true, 
        messageId: result.messageId 
      }
    } else {
      console.error('❌ Brevo email failed:', result)
      return { success: false, error: result.message || 'Brevo API error' }
    }
    
  } catch (error) {
    console.error('❌ Brevo email error:', error.message)
    return { success: false, error: error.message }
  }
}

export const sendWelcomeEmailBrevo = async (email, name, role) => {
  try {
    console.log(`📧 Sending welcome email via Brevo to ${email}`)
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: 'Edunexs LearnSphere',
          email: 'noreply@edunexs-platform.com'
        },
        to: [{
          email: email,
          name: name
        }],
        subject: `Welcome to Edunexs LearnSphere, ${name}! 🎉`,
        htmlContent: `
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
                <a href="${process.env.CLIENT_URL || 'https://edunexs-client.vercel.app'}/dashboard" 
                   style="background: white; color: #059669; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Access Your Dashboard</a>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; font-size: 12px; margin: 0;">Need help getting started? Contact us at support@edunexs.com</p>
                <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">© 2024 Edunexs LearnSphere. All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
        textContent: `Welcome to Edunexs LearnSphere, ${name}! Your account has been verified successfully.`
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Brevo welcome email sent:', result.messageId)
      return { 
        success: true, 
        messageId: result.messageId 
      }
    } else {
      console.error('❌ Brevo welcome email failed:', result)
      return { success: false, error: result.message || 'Brevo API error' }
    }
    
  } catch (error) {
    console.error('❌ Brevo welcome email error:', error.message)
    return { success: false, error: error.message }
  }
}

export default {
  sendVerificationEmailBrevo,
  sendWelcomeEmailBrevo
}