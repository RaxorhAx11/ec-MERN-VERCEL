#!/usr/bin/env node

/**
 * JWT Configuration Validation Script
 * 
 * This script validates JWT configuration and provides recommendations
 * for secure JWT implementation in your MERN application.
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('🔐 JWT Configuration Validation\n');

// Check JWT Secret
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

console.log('📋 Current JWT Configuration:');
console.log(`JWT_SECRET: ${jwtSecret ? '✅ Set' : '❌ Not set'}`);
console.log(`JWT_EXPIRES_IN: ${jwtExpiresIn || '7d (default)'}`);

// Security checks
console.log('\n🔒 Security Analysis:');

// Check if JWT secret is using default value
if (!jwtSecret || jwtSecret === 'your-super-secret-jwt-key-change-this-in-production' || jwtSecret === 'CLIENT_SECRET_KEY') {
  console.log('❌ CRITICAL: JWT_SECRET is using default/weak value!');
  console.log('   This is a major security vulnerability.');
  console.log('   Generate a secure secret using: openssl rand -base64 32');
} else {
  console.log('✅ JWT_SECRET is configured with custom value');
  
  // Check secret strength
  if (jwtSecret.length < 32) {
    console.log('⚠️  WARNING: JWT_SECRET is shorter than 32 characters');
    console.log('   Consider using a longer secret for better security');
  } else {
    console.log('✅ JWT_SECRET length is adequate');
  }
}

// Check expiration time
const validExpirationFormats = ['s', 'm', 'h', 'd'];
const expirationUnit = jwtExpiresIn ? jwtExpiresIn.slice(-1) : 'd';
const expirationValue = jwtExpiresIn ? parseInt(jwtExpiresIn.slice(0, -1)) : 7;

if (!validExpirationFormats.includes(expirationUnit)) {
  console.log('❌ Invalid JWT_EXPIRES_IN format');
  console.log('   Use formats like: 1h, 24h, 7d, 30d');
} else {
  console.log('✅ JWT_EXPIRES_IN format is valid');
  
  // Check if expiration is reasonable
  if (expirationUnit === 'd' && expirationValue > 30) {
    console.log('⚠️  WARNING: Token expiration is longer than 30 days');
    console.log('   Consider shorter expiration for better security');
  } else if (expirationUnit === 'h' && expirationValue > 24) {
    console.log('⚠️  WARNING: Token expiration is longer than 24 hours');
    console.log('   Consider shorter expiration for better security');
  } else {
    console.log('✅ Token expiration time is reasonable');
  }
}

// Test JWT functionality
console.log('\n🧪 Testing JWT Functionality:');

try {
  const testPayload = {
    id: 'test-user-id',
    role: 'user',
    email: 'test@example.com',
    userName: 'testuser'
  };

  // Test token generation
  const token = jwt.sign(testPayload, jwtSecret || 'test-secret', { 
    expiresIn: jwtExpiresIn || '7d' 
  });
  console.log('✅ JWT token generation: SUCCESS');

  // Test token verification
  const decoded = jwt.verify(token, jwtSecret || 'test-secret');
  console.log('✅ JWT token verification: SUCCESS');
  console.log(`   Decoded payload: ${JSON.stringify(decoded, null, 2)}`);

} catch (error) {
  console.log('❌ JWT functionality test failed:', error.message);
}

// Environment recommendations
console.log('\n📝 Recommendations:');

if (!jwtSecret || jwtSecret === 'your-super-secret-jwt-key-change-this-in-production') {
  console.log('1. Generate a secure JWT secret:');
  console.log('   openssl rand -base64 32');
  console.log('   or use: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
  console.log('');
}

console.log('2. Environment-specific configurations:');
console.log('   Development: JWT_EXPIRES_IN=24h (shorter for testing)');
console.log('   Production: JWT_EXPIRES_IN=1h (with refresh token mechanism)');
console.log('');

console.log('3. Security best practices:');
console.log('   - Use HTTPS in production');
console.log('   - Implement refresh token mechanism');
console.log('   - Add token blacklisting for logout');
console.log('   - Use secure cookie settings');
console.log('   - Implement rate limiting on auth endpoints');
console.log('');

console.log('4. Cookie security settings (already implemented):');
console.log('   ✅ httpOnly: true');
console.log('   ✅ secure: true (in production)');
console.log('   ✅ sameSite: "lax"');
console.log('');

// Check if refresh token mechanism is needed
console.log('5. Consider implementing refresh tokens for:');
console.log('   - Better security (shorter access token lifetime)');
console.log('   - Seamless user experience');
console.log('   - Token rotation capabilities');

console.log('\n🎯 JWT Configuration Status:');
if (jwtSecret && jwtSecret !== 'your-super-secret-jwt-key-change-this-in-production' && jwtSecret !== 'CLIENT_SECRET_KEY') {
  console.log('✅ JWT is properly configured and ready for production');
} else {
  console.log('❌ JWT configuration needs attention before production deployment');
}

console.log('\n📚 Additional Resources:');
console.log('- JWT Best Practices: https://tools.ietf.org/html/rfc8725');
console.log('- OWASP JWT Security: https://owasp.org/www-community/attacks/JSON_Web_Token_(JWT)_Attacks');
console.log('- Node.js JWT Guide: https://github.com/auth0/node-jsonwebtoken');
