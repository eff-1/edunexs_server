import fetch from 'node-fetch'

async function testLoginOnly() {
  console.log('🔐 Testing Login with Existing Users')
  
  const testUsers = [
    {
      type: 'Student',
      email: 'student@test.com',
      password: 'password123'
    },
    {
      type: 'Tutor', 
      email: 'tutor@test.com',
      password: 'password123'
    },
    {
      type: 'Simple Test User',
      email: 'simple-test@example.com', 
      password: 'password123'
    }
  ]

  for (const testUser of testUsers) {
    console.log(`\n🔐 Testing ${testUser.type} Login...`)
    
    try {
      const loginResponse = await fetch('https://edunexs-server.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      })

      const loginData = await loginResponse.json()
      console.log(`${testUser.type} Login Status:`, loginResponse.status)
      
      if (loginData.success) {
        console.log(`✅ ${testUser.type} login successful!`)
        console.log('User ID:', loginData.user._id)
        console.log('Email:', loginData.user.email)
        console.log('Role:', loginData.user.role)
        console.log('Token received:', loginData.token ? 'YES' : 'NO')
        console.log('Email verified:', loginData.user.isEmailVerified)
        console.log('Account active:', loginData.user.isActive)
      } else {
        console.log(`❌ ${testUser.type} login failed:`, loginData.message)
        if (loginData.error) {
          console.log('Error details:', loginData.error)
        }
      }
      
    } catch (error) {
      console.error(`❌ ${testUser.type} login test failed:`, error.message)
    }
  }
  
  console.log('\n🎯 Login Test Summary:')
  console.log('Testing login functionality with existing users...')
}

testLoginOnly()