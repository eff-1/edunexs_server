import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

const BASE_URL = 'http://localhost:5003/api/auth'

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'student',
  country: 'Nigeria'
}

async function testEndpoints() {
  console.log('🧪 Testing All Authentication Endpoints...\n')

  try {
    // Test 1: Registration
    console.log('1️⃣ Testing Registration...')
    const registerResponse = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })
    
    const registerResult = await registerResponse.json()
    console.log('📝 Registration Response:', registerResult)
    
    if (registerResult.success) {
      console.log('✅ Registration successful!')
      console.log('📧 Email should be sent for verification')
    } else {
      console.log('❌ Registration failed:', registerResult.message)
    }
    console.log('---\n')

    // Test 2: Resend OTP
    console.log('2️⃣ Testing Resend OTP...')
    const resendResponse = await fetch(`${BASE_URL}/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email })
    })
    
    const resendResult = await resendResponse.json()
    console.log('📧 Resend OTP Response:', resendResult)
    
    if (resendResult.success) {
      console.log('✅ Resend OTP successful!')
    } else {
      console.log('❌ Resend OTP failed:', resendResult.message)
    }
    console.log('---\n')

    // Test 3: Email Verification (with dummy OTP)
    console.log('3️⃣ Testing Email Verification...')
    const verifyResponse = await fetch(`${BASE_URL}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testUser.email, 
        otp: '123456' // This will fail but we can see the response
      })
    })
    
    const verifyResult = await verifyResponse.json()
    console.log('🔍 Verification Response:', verifyResult)
    console.log('---\n')

    // Test 4: Login (will fail since not verified)
    console.log('4️⃣ Testing Login...')
    const loginResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testUser.email, 
        password: testUser.password 
      })
    })
    
    const loginResult = await loginResponse.json()
    console.log('🔐 Login Response:', loginResult)
    console.log('---\n')

    // Test 5: Forgot Password
    console.log('5️⃣ Testing Forgot Password...')
    const forgotResponse = await fetch(`${BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email })
    })
    
    const forgotResult = await forgotResponse.json()
    console.log('🔑 Forgot Password Response:', forgotResult)
    
    if (forgotResult.success) {
      console.log('✅ Password reset email should be sent!')
    } else {
      console.log('❌ Forgot password failed:', forgotResult.message)
    }
    console.log('---\n')

    // Test 6: Reset Password (with dummy OTP)
    console.log('6️⃣ Testing Reset Password...')
    const resetResponse = await fetch(`${BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testUser.email,
        otp: '123456', // This will fail but we can see the response
        newPassword: 'newpassword123'
      })
    })
    
    const resetResult = await resetResponse.json()
    console.log('🔄 Reset Password Response:', resetResult)
    console.log('---\n')

    console.log('🎉 All endpoint tests completed!')
    console.log('\n📊 Summary:')
    console.log('- Registration endpoint tested')
    console.log('- Email sending functionality tested')
    console.log('- OTP resend functionality tested')
    console.log('- Verification endpoint tested')
    console.log('- Login endpoint tested')
    console.log('- Forgot password endpoint tested')
    console.log('- Reset password endpoint tested')

  } catch (error) {
    console.error('❌ Test error:', error.message)
    console.log('\n💡 Make sure the server is running on port 5003')
    console.log('Run: npm run dev or node src/server.js')
  }
}

testEndpoints()