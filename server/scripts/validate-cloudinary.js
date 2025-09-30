#!/usr/bin/env node

/**
 * Cloudinary Configuration Validation Script
 * 
 * This script validates your Cloudinary setup and provides detailed feedback
 * on configuration, connectivity, and usage limits.
 * 
 * Usage:
 *   node scripts/validate-cloudinary.js
 *   npm run validate:cloudinary
 */

require('dotenv').config();
const { validateCloudinaryConfig } = require('../helpers/validate-cloudinary');

async function main() {
  console.log('🚀 Cloudinary Configuration Validator');
  console.log('=====================================\n');

  try {
    const result = await validateCloudinaryConfig();
    
    if (result.isValid) {
      console.log('\n🎉 All validations passed! Your Cloudinary setup is ready.');
      process.exit(0);
    } else {
      console.log('\n❌ Validation failed. Please fix the errors above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Validation script failed:', error.message);
    process.exit(1);
  }
}

// Run the validation
main();
