import fetch from 'node-fetch'

const API_BASE = 'http://localhost:5003/api/auth'

async function testSimpleRegistration() {
  console.log('🧪 Testing Simple Registration (No Email Verification)')
  
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'student',
    country: 'Nigeria',
    academicLevel: 'undergraduate',
    targetExams: ['JAMB'],
    specialization: 'Science'
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
    console.log('Registration Response:', registerData)

    if (registerData.success) {
      console.log('✅ Registration successful!')
      console.log('🎫 Token received:', registerData.data.token ? 'YES' : 'NO')
      console.log('👤 User data:', registerData.data.user.email)
      
      // Test Login with same credentials
      console.log('\n🔐 Testing Login...')
      const loginResponse = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      })

      const loginData = await loginResponse.json()
      console.log('Login Response:', loginData)

      if (loginData.success) {
        console.log('✅ Login successful!')
        console.log('🎫 Login token received:', loginData.token ? 'YES' : 'NO')
      } else {
        console.log('❌ Login failed:', loginData.message)
      }

    } else {
      console.log('❌ Registration failed:', registerData.message)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testSimpleRegistration()