import fetch from 'node-fetch'

const API_BASE = 'https://edunexs-server.onrender.com/api/auth'

async function testLogin() {
  console.log('🔍 Testing Login on Production Server')
  
  // Test with a simple user
  const testCredentials = {
    email: 'test@example.com',
    password: 'password123'
  }

  try {
    console.log('\n📝 Testing Registration first...')
    const registerResponse = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testCredentials.email,
        password: testCredentials.password,
        role: 'student',
        country: 'Nigeria',
        academicLevel: 'undergraduate',
        targetExams: ['JAMB']
      })
    })

    const registerData = await registerResponse.json()
    console.log('Registration Response Status:', registerResponse.status)
    console.log('Registration Response:', registerData)

    if (registerData.success) {
      console.log('✅ Registration successful')
      
      // Now test login
      console.log('\n🔐 Testing Login...')
      const loginResponse = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCredentials)
      })

      const loginData = await loginResponse.json()
      console.log('Login Response Status:', loginResponse.status)
      console.log('Login Response:', loginData)

      if (loginData.success) {
        console.log('✅ Login successful!')
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

testLogin()