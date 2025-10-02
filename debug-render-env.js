// Debug script to check environment variables on Render
console.log('🔍 Environment Variables Debug for Render:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('EMAIL_HOST:', process.env.EMAIL_HOST)
console.log('EMAIL_PORT:', process.env.EMAIL_PORT)
console.log('EMAIL_USER:', process.env.EMAIL_USER)
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (length: ' + process.env.EMAIL_PASS.length + ')' : 'NOT SET')
console.log('EMAIL_FROM:', process.env.EMAIL_FROM)

// Test if credentials are correct
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log('✅ Email credentials are set')
  console.log('📧 Email user:', process.env.EMAIL_USER)
  console.log('🔑 Password length:', process.env.EMAIL_PASS.length)
  
  // Check if password format is correct (should be 16 chars without spaces for app password)
  const pass = process.env.EMAIL_PASS
  console.log('Password analysis:')
  console.log('- Has spaces:', pass.includes(' '))
  console.log('- Length:', pass.length)
  console.log('- First 4 chars:', pass.substring(0, 4))
} else {
  console.log('❌ Email credentials missing!')
}

console.log('\n🌐 Network test - trying to resolve smtp.gmail.com...')
import { promises as dns } from 'dns'

try {
  const addresses = await dns.resolve4('smtp.gmail.com')
  console.log('✅ DNS resolution successful:', addresses)
} catch (error) {
  console.log('❌ DNS resolution failed:', error.message)
}