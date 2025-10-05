import fetch from 'node-fetch'

async function testDatabaseConnection() {
  console.log('🗄️ Testing Database Connection via API')
  
  try {
    // Test a simple endpoint that doesn't require complex operations
    const response = await fetch('https://edunexs-server.onrender.com/api/auth/health')
    const data = await response.json()
    
    console.log('Health Check Status:', response.status)
    console.log('Health Check Response:', data)
    
    if (data.success) {
      console.log('✅ Basic server is working')
      
      // Now test if we can connect to database by trying to find a user (should fail gracefully)
      console.log('\n🔍 Testing database connection with a simple login attempt...')
      
      const loginResponse = await fetch('https://edunexs-server.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@test.com',
          password: 'test123'
        })
      })
      
      const loginData = await loginResponse.json()
      console.log('Login Test Status:', loginResponse.status)
      console.log('Login Test Response:', loginData)
      
      if (loginResponse.status === 400 && loginData.message === 'Invalid email or password') {
        console.log('✅ Database connection is working (got expected "user not found" response)')
      } else if (loginResponse.status === 500) {
        console.log('❌ Database connection issue (500 error)')
        console.log('Error details:', loginData)
      } else {
        console.log('🤔 Unexpected response:', loginData)
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testDatabaseConnection()