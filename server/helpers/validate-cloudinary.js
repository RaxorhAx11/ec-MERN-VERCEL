const cloudinary = require('cloudinary').v2;

/**
 * Comprehensive Cloudinary configuration validation
 * Validates environment variables, connectivity, and permissions
 */
class CloudinaryValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  /**
   * Validate all Cloudinary configuration
   */
  async validate() {
    console.log('🔍 Validating Cloudinary configuration...\n');

    // Step 1: Validate environment variables
    this.validateEnvironmentVariables();

    // Step 2: Test Cloudinary connection
    await this.validateConnection();

    // Step 3: Test upload permissions
    await this.validateUploadPermissions();

    // Step 4: Test transformation capabilities
    await this.validateTransformations();

    // Step 5: Check usage limits
    await this.checkUsageLimits();

    // Display results
    this.displayResults();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      success: this.success
    };
  }

  /**
   * Validate required environment variables
   */
  validateEnvironmentVariables() {
    console.log('📋 Checking environment variables...');

    const requiredVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      this.errors.push(`Missing required environment variables: ${missingVars.join(', ')}`);
      return;
    }

    // Validate format of environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Cloud name should be alphanumeric with hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(cloudName)) {
      this.errors.push('CLOUDINARY_CLOUD_NAME should contain only alphanumeric characters and hyphens');
    }

    // API key should be numeric
    if (!/^\d+$/.test(apiKey)) {
      this.errors.push('CLOUDINARY_API_KEY should be numeric');
    }

    // API secret should be alphanumeric
    if (!/^[a-zA-Z0-9]+$/.test(apiSecret)) {
      this.errors.push('CLOUDINARY_API_SECRET should be alphanumeric');
    }

    if (this.errors.length === 0) {
      this.success.push('✅ Environment variables are properly configured');
    }

    // Configure Cloudinary with validated credentials
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
  }

  /**
   * Test Cloudinary connection
   */
  async validateConnection() {
    console.log('🔗 Testing Cloudinary connection...');

    try {
      // Test connection by getting account details
      const result = await cloudinary.api.ping();
      
      if (result.status === 'ok') {
        this.success.push('✅ Cloudinary connection successful');
      } else {
        this.errors.push('❌ Cloudinary connection failed');
      }
    } catch (error) {
      this.errors.push(`❌ Cloudinary connection failed: ${error.message}`);
    }
  }

  /**
   * Test upload permissions
   */
  async validateUploadPermissions() {
    console.log('📤 Testing upload permissions...');

    try {
      // Create a small test image (1x1 pixel PNG)
      const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      const result = await cloudinary.uploader.upload(testImage, {
        folder: 'test',
        public_id: `test-${Date.now()}`,
        overwrite: true
      });

      if (result && result.public_id) {
        this.success.push('✅ Upload permissions verified');
        
        // Clean up test image
        await cloudinary.uploader.destroy(result.public_id);
        this.success.push('✅ Test image cleaned up');
      } else {
        this.errors.push('❌ Upload test failed');
      }
    } catch (error) {
      this.errors.push(`❌ Upload test failed: ${error.message}`);
    }
  }

  /**
   * Test transformation capabilities
   */
  async validateTransformations() {
    console.log('🎨 Testing transformation capabilities...');

    try {
      // Test URL generation for transformations
      const testPublicId = 'sample';
      const transformedUrl = cloudinary.url(testPublicId, {
        width: 100,
        height: 100,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      });

      if (transformedUrl && transformedUrl.includes('cloudinary.com')) {
        this.success.push('✅ Transformation capabilities verified');
      } else {
        this.warnings.push('⚠️ Transformation test inconclusive');
      }
    } catch (error) {
      this.warnings.push(`⚠️ Transformation test failed: ${error.message}`);
    }
  }

  /**
   * Check usage limits and account status
   */
  async checkUsageLimits() {
    console.log('📊 Checking usage limits...');

    try {
      const usage = await cloudinary.api.usage();
      
      if (usage) {
        const storageUsed = usage.used_storage || 0;
        const bandwidthUsed = usage.used_bandwidth || 0;
        const transformationsUsed = usage.used_transformations || 0;

        this.success.push(`📈 Storage used: ${(storageUsed / 1024 / 1024).toFixed(2)} MB`);
        this.success.push(`📈 Bandwidth used: ${(bandwidthUsed / 1024 / 1024).toFixed(2)} MB`);
        this.success.push(`📈 Transformations used: ${transformationsUsed}`);

        // Check if approaching limits
        if (usage.plan === 'free') {
          if (storageUsed > 20 * 1024 * 1024) { // 20MB
            this.warnings.push('⚠️ Storage usage is high (>20MB)');
          }
          if (bandwidthUsed > 20 * 1024 * 1024) { // 20MB
            this.warnings.push('⚠️ Bandwidth usage is high (>20MB)');
          }
        }
      }
    } catch (error) {
      this.warnings.push(`⚠️ Could not retrieve usage information: ${error.message}`);
    }
  }

  /**
   * Display validation results
   */
  displayResults() {
    console.log('\n📋 Validation Results:');
    console.log('='.repeat(50));

    if (this.success.length > 0) {
      console.log('\n✅ Success:');
      this.success.forEach(message => console.log(`  ${message}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.warnings.forEach(message => console.log(`  ${message}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(message => console.log(`  ${message}`));
    }

    console.log('\n' + '='.repeat(50));

    if (this.errors.length === 0) {
      console.log('🎉 Cloudinary configuration is valid and ready to use!');
    } else {
      console.log('❌ Please fix the errors above before using Cloudinary.');
    }
  }
}

/**
 * Quick validation function for use in other modules
 */
async function validateCloudinaryConfig() {
  const validator = new CloudinaryValidator();
  return await validator.validate();
}

/**
 * Validate specific Cloudinary credentials
 */
async function validateCredentials(cloudName, apiKey, apiSecret) {
  const originalConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  };

  try {
    // Temporarily set credentials
    process.env.CLOUDINARY_CLOUD_NAME = cloudName;
    process.env.CLOUDINARY_API_KEY = apiKey;
    process.env.CLOUDINARY_API_SECRET = apiSecret;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });

    const result = await cloudinary.api.ping();
    
    // Restore original configuration
    process.env.CLOUDINARY_CLOUD_NAME = originalConfig.cloud_name;
    process.env.CLOUDINARY_API_KEY = originalConfig.api_key;
    process.env.CLOUDINARY_API_SECRET = originalConfig.api_secret;

    return result.status === 'ok';
  } catch (error) {
    // Restore original configuration on error
    process.env.CLOUDINARY_CLOUD_NAME = originalConfig.cloud_name;
    process.env.CLOUDINARY_API_KEY = originalConfig.api_key;
    process.env.CLOUDINARY_API_SECRET = originalConfig.api_secret;
    
    return false;
  }
}

module.exports = {
  CloudinaryValidator,
  validateCloudinaryConfig,
  validateCredentials
};
