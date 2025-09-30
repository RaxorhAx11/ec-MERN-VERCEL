const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Enhanced Cloudinary configuration with validation
const validateCloudinaryConfig = () => {
  const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
  }
};

// Validate configuration on startup
try {
  validateCloudinaryConfig();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS
  });
  console.log("✅ Cloudinary configuration validated successfully");
} catch (error) {
  console.error("❌ Cloudinary configuration error:", error.message);
  console.log("Please check your .env file and ensure all Cloudinary credentials are set");
}

const storage = new multer.memoryStorage();

// Enhanced image upload utility with multiple presets
async function imageUploadUtil(file, options = {}) {
  try {
    const {
      folder = 'ecommerce',
      quality = 'auto',
      format = 'auto',
      width = 1200,
      height = 1200,
      crop = 'limit'
    } = options;

    const uploadOptions = {
      resource_type: "auto",
      quality: quality,
      fetch_format: format,
      folder: folder,
      transformation: [
        { width: width, height: height, crop: crop },
        { quality: quality }
      ],
      // Add metadata for better organization
      context: {
        alt: "Product image",
        caption: "E-commerce product image"
      },
      // Enable eager transformations for faster loading
      eager: [
        { width: 300, height: 300, crop: "fill", gravity: "auto" },
        { width: 600, height: 600, crop: "fill", gravity: "auto" },
        { width: 1200, height: 1200, crop: "limit" }
      ],
      // Enable responsive images
      responsive: true
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    if (!result || !result.url) {
      throw new Error("Cloudinary upload failed - no URL returned");
    }

    return {
      ...result,
      // Add additional useful information
      optimized_url: result.eager?.[0]?.secure_url || result.secure_url,
      thumbnail_url: result.eager?.[0]?.secure_url,
      medium_url: result.eager?.[1]?.secure_url,
      large_url: result.eager?.[2]?.secure_url
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

// Bulk image upload utility
async function bulkImageUpload(files, options = {}) {
  try {
    const uploadPromises = files.map(file => imageUploadUtil(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Bulk upload error:", error);
    throw new Error(`Bulk upload failed: ${error.message}`);
  }
}

// Image deletion utility
async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Image deletion error:", error);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
}

// Bulk image deletion utility
async function bulkDeleteImages(publicIds) {
  try {
    const deletePromises = publicIds.map(publicId => deleteImage(publicId));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error("Bulk deletion error:", error);
    throw new Error(`Bulk deletion failed: ${error.message}`);
  }
}

// Image transformation utility
async function transformImage(publicId, transformations = {}) {
  try {
    const {
      width = 300,
      height = 300,
      crop = 'fill',
      gravity = 'auto',
      quality = 'auto',
      format = 'auto'
    } = transformations;

    const url = cloudinary.url(publicId, {
      width,
      height,
      crop,
      gravity,
      quality,
      format
    });

    return url;
  } catch (error) {
    console.error("Image transformation error:", error);
    throw new Error(`Image transformation failed: ${error.message}`);
  }
}

// Enhanced multer configuration
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB limit
    files: 5, // Allow up to 5 files at once
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp', 
      'image/svg+xml',
      'image/avif' // Add support for modern formats
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Multiple file upload configuration
const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp', 
      'image/svg+xml',
      'image/avif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  }
});

module.exports = { 
  upload, 
  uploadMultiple,
  imageUploadUtil, 
  bulkImageUpload,
  deleteImage,
  bulkDeleteImages,
  transformImage,
  cloudinary
};
