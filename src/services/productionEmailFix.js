// TEMPORARY: Production email workaround for Render SMTP issues

export const handleProductionEmail = async (email, otp, name) => {
  console.log(`📧 Production email handling for ${email}`)
  console.log(`🔑 OTP Generated: ${otp}`)
  
  // For now, log the OTP to server logs so you can manually verify users
  console.log('=' * 50)
  console.log(`MANUAL VERIFICATION FOR: ${email}`)
  console.log(`OTP CODE: ${otp}`)
  console.log(`NAME: ${name}`)
  console.log('=' * 50)
  
  // Return success so registration can continue
  // TODO: Fix Render SMTP and remove this workaround
  return { 
    success: true, 
    messageId: 'manual-verification-' + Date.now(),
    note: 'Manual verification required - check server logs for OTP'
  }
}

export const skipEmailVerificationForProduction = async (userData) => {
  console.log('⚠️ SKIPPING EMAIL VERIFICATION FOR PRODUCTION')
  console.log('Creating user directly without email verification')
  
  return {
    skipVerification: true,
    userData: {
      ...userData,
      isEmailVerified: true, // Mark as verified
      emailVerifiedAt: new Date()
    }
  }
}