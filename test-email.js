import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const testEmailService = async () => {
    console.log('🔍 Testing Email Service Configuration...')
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER)
    console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : '❌ NOT SET')
    console.log('📤 EMAIL_FROM:', process.env.EMAIL_FROM)
    console.log('🏠 EMAIL_HOST:', process.env.EMAIL_HOST)
    console.log('🔌 EMAIL_PORT:', process.env.EMAIL_PORT)

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Email credentials not configured properly')
        return
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: true,
        debug: true
    })

    try {
        console.log('🔄 Testing SMTP connection...')
        await transporter.verify()
        console.log('✅ SMTP connection successful!')

        console.log('🔄 Testing email sending...')
        const result = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Edunexs Email Service Test',
            html: `
        <h2>🎉 Email Service Working!</h2>
        <p>This is a test email from Edunexs LearnSphere.</p>
        <p>If you receive this, the email service is configured correctly.</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
        })

        console.log('✅ Test email sent successfully!')
        console.log('📧 Message ID:', result.messageId)
        console.log('📬 Check your inbox for the test email')

    } catch (error) {
        console.error('❌ Email service error:')
        console.error('Error Code:', error.code)
        console.error('Error Message:', error.message)

        if (error.code === 'EAUTH') {
            console.error('🔑 Authentication failed - check your Gmail app password')
        } else if (error.code === 'ECONNECTION') {
            console.error('🌐 Connection failed - check your internet/firewall')
        } else if (error.code === 'ETIMEDOUT') {
            console.error('⏰ Connection timed out - check SMTP settings')
        }
    }
}

testEmailService()