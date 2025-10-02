import dotenv from 'dotenv'

dotenv.config()

console.log('🔍 Environment Variables Debug:')
console.log('EMAIL_HOST:', process.env.EMAIL_HOST)
console.log('EMAIL_PORT:', process.env.EMAIL_PORT)
console.log('EMAIL_USER:', process.env.EMAIL_USER)
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET')
console.log('EMAIL_PASS value:', process.env.EMAIL_PASS ? `"${process.env.EMAIL_PASS}"` : 'NOT SET')
console.log('EMAIL_FROM:', process.env.EMAIL_FROM)

// Test if the password has the correct format
if (process.env.EMAIL_PASS) {
  const pass = process.env.EMAIL_PASS
  console.log('Password analysis:')
  console.log('- Contains spaces:', pass.includes(' '))
  console.log('- Length:', pass.length)
  console.log('- First 4 chars:', pass.substring(0, 4))
  console.log('- Last 4 chars:', pass.substring(pass.length - 4))
  console.log('- Expected format: "xxxx xxxx xxxx xxxx" (16 chars with spaces)')
}