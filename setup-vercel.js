#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MERN E-commerce for Vercel deployment...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  'client/package.json',
  'api/lib/db.js',
  'api/lib/middleware.js'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all files are created.');
  process.exit(1);
}

console.log('\n📁 Checking directory structure...');
const requiredDirs = [
  'api',
  'api/auth',
  'api/shop',
  'api/admin',
  'api/common',
  'api/lib',
  'api/models',
  'api/controllers',
  'api/helpers',
  'client'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required directories are missing. Please ensure all directories are created.');
  process.exit(1);
}

console.log('\n🔧 Environment Variables Setup:');
console.log('Please set the following environment variables in your Vercel dashboard:');
console.log('');
console.log('Required:');
console.log('- MONGODB_URL: Your MongoDB Atlas connection string');
console.log('- JWT_SECRET: A secure random string for JWT tokens');
console.log('- CLIENT_BASE_URL: Your Vercel app URL');
console.log('');
console.log('Optional:');
console.log('- EMAIL_HOST, EMAIL_USER, EMAIL_PASS: For email functionality');
console.log('- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: For image uploads');
console.log('- PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET: For payment processing');
console.log('');

console.log('📦 Installing dependencies...');
console.log('Run: npm run install-all');
console.log('');

console.log('🚀 Deployment Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your GitHub repository to Vercel');
console.log('3. Set environment variables in Vercel dashboard');
console.log('4. Deploy!');
console.log('');

console.log('📚 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md');
console.log('');
console.log('✅ Setup complete! Your project is ready for Vercel deployment.');
