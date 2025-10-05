import fetch from 'node-fetch'

async function testHealthCheck() {
  console.log('🏥 Testing Health Check Endpoint')
  
  try {
    const response = await fetch('https://edunexs-server.onrender.com/api/auth/health')
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', data)
    
    if (data.success) {
      console.log('✅ Server is running!')
      console.log('Environment:', data.environment)
      console.log('Timestamp:', data.timestamp)
    } else {
      console.log('❌ Server health check failed')
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message)
  }
}

testHealthCheck()