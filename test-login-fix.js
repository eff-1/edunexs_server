import fetch from 'node-fetch'

const API_BASE = 'http://localhost:5003/api/auth'

async function testLoginFix() {
  console.log('🧪 Testing Login Fix (Password Hashing Issue)')
  
  const testUser = {
    name: 'Login Test User',
    email: 'logintest@example.com',
    password: 'testpass123',
    role: 'student',
    country: 'Nigeria',
    academicLevel: 'undergraduate',
    targetExams: ['JAMB']
  }

  try {
    // Test Registration
    console.log('\n📝 Testing Registration...')
    const registerResponse = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })

    const registerData = await registerResponse.json()
    console.log('Registration Response:', registerData.success ? '✅ SUCCESS' : '❌ FAILED')
    
    if (registerData.success) {
      console.log('🎫 Token received:', registerData.data.token ? 'YES' : 'NO')
      
      // Wait a moment for database to sync
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Test Login with same credentials
      console.log('\n🔐 Testing Login with same credentials...')
      const loginResponse = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      })

      const loginData = await loginResponse.json()
      console.log('Login Response:', loginData.success ? '✅ SUCCESS' : '❌ FAILED')
      
      if (loginData.success) {
        console.log('🎫 Login token received:', loginData.token ? 'YES' : 'NO')
        console.log('👤 User email:', loginData.user?.email)
        console.log('\n🎉 PASSWORD HASHING FIX WORKS!')
      } else {
        console.log('❌ Login failed:', loginData.message)
        console.log('\n🔍 This suggests the password hashing issue still exists')
      }

    } else {
      console.log('❌ Registration failed:', registerData.message)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testLoginFix()