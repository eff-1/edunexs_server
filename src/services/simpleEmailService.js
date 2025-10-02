import nodemailer from 'nodemailer'

// Simple email service that matches your working test.js exactly
const createTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "edunexlearnsphere@gmail.com",
            pass: "nkej nigj bjec cmnw",
        },
        tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
        },
        logger: true,
        debug: true,
    })
}

export const sendVerificationEmail = async (email, otp, name = '') => {
    try {
        const transporter = createTransporter()

        const result = await transporter.sendMail({
            from: '"Edunexs LearnSphere" <edunexlearnsphere@gmail.com>',
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
        })

        console.log('✅ Simple email service - Email sent:', result.messageId)
        return { success: true, messageId: result.messageId }

    } catch (error) {
        console.error('❌ Simple email service error:', error)
        return { success: false, error: error.message }
    }
}

export const sendWelcomeEmail = async (email, name, role) => {
    try {
        const transporter = createTransporter()

        const result = await transporter.sendMail({
            from: '"Edunexs LearnSphere" <edunexlearnsphere@gmail.com>',
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
            text: `Welcome to Edunexs LearnSphere, ${name}! Your account has been verified. Visit ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard to get started.`
        })

        console.log('✅ Simple welcome email sent:', result.messageId)
        return { success: true, messageId: result.messageId }

    } catch (error) {
        console.error('❌ Simple welcome email error:', error)
        return { success: false, error: error.message }
    }
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail
}