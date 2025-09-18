import nodemailer from 'nodemailer'

export const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Email options
    const mailOptions = {
      from: `Edunexs LearnSphere <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent:', info.messageId)
    
    return info
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    throw new Error('Email could not be sent')
  }
}