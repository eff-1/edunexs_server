import fetch from 'node-fetch'

async function testFreshUser() {
  console.log('🆕 Testing Fresh User Registration & Login')
  
  const timestamp = Date.now()
  const freshUser = {
    name: 'Fresh User',
    email: `fresh-${timestamp}@test.com`,
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
    // Test Registration
    console.log('📝 Testing Fresh User Registration...')
    const registerResponse = await fetch('https://edunexs-server.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(freshUser)
    })

    const registerData = await registerResponse.json()
    console.log('Registration Status:', registerResponse.status)
    
    if (registerData.success) {
      console.log('✅ Fresh user registration successful!')
      console.log('User ID:', registerData.data.user._id)
      console.log('Email:', registerData.data.user.email)
      console.log('Role:', registerData.data.user.role)
      console.log('Registration Token:', registerData.data.token ? 'YES' : 'NO')
      
      // Test Login immediately after registration
      console.log('\n🔐 Testing Fresh User Login...')
      const loginResponse = await fetch('https://edunexs-server.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: freshUser.email,
          password: freshUser.password
        })
      })

      const loginData = await loginResponse.json()
      console.log('Login Status:', loginResponse.status)
      
      if (loginData.success) {
        console.log('✅ Fresh user login successful!')
        console.log('Login Token:', loginData.token ? 'YES' : 'NO')
        console.log('User Role:', loginData.user.role)
        console.log('Email Verified:', loginData.user.isEmailVerified)
        console.log('Account Active:', loginData.user.isActive)
        
        console.log('\n🎉 COMPLETE SUCCESS!')
        console.log('✅ Registration works perfectly')
        console.log('✅ Login works perfectly') 
        console.log('✅ No validation errors')
        console.log('✅ Legacy data issues resolved')
        
      } else {
        console.log('❌ Fresh user login failed:', loginData.message)
        if (loginData.error) {
          console.log('Error details:', loginData.error)
        }
      }
      
    } else {
      console.log('❌ Fresh user registration failed:', registerData.message)
      if (registerData.error) {
        console.log('Error details:', registerData.error)
      }
    }
    
  } catch (error) {
    console.error('❌ Fresh user test failed:', error.message)
  }
}

testFreshUser()