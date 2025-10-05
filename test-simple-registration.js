import fetch from 'node-fetch'

async function testSimpleRegistration() {
  console.log('🧪 Testing Simple Registration')
  
  const simpleUser = {
    name: 'Test User',
    email: 'simple-test@example.com',
    password: 'password123',
    role: 'student',
    country: 'Nigeria',
    academicLevel: 'undergraduate',
    targetExams: [{
      examCode: 'JAMB',
      subjects: ['Mathematics', 'Physics'],
      targetYear: 2025,
      priority: 'high'
    }]
  }

  try {
    console.log('📝 Attempting registration with minimal data...')
    const response = await fetch('https://edunexs-server.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simpleUser)
    })

    const data = await response.json()
    console.log('Registration Status:', response.status)
    console.log('Registration Response:', data)

    if (response.status === 201 && data.success) {
      console.log('✅ Registration successful!')
      console.log('User created:', data.data.user.email)
      console.log('Token received:', data.data.token ? 'YES' : 'NO')
      
      // Test login with the same credentials
      console.log('\n🔐 Testing login with registered user...')
      const loginResponse = await fetch('https://edunexs-server.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: simpleUser.email,
          password: simpleUser.password
        })
      })

      const loginData = await loginResponse.json()
      console.log('Login Status:', loginResponse.status)
      console.log('Login Response:', loginData)

      if (loginData.success) {
        console.log('✅ Login successful!')
        console.log('🎉 Both registration and login are working!')
      } else {
        console.log('❌ Login failed:', loginData.message)
      }

    } else {
      console.log('❌ Registration failed')
      if (data.error) {
        console.log('Error details:', data.error)
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testSimpleRegistration()