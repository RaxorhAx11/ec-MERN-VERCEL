const { imageUploadUtil, bulkImageUpload, deleteImage, transformImage } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB"
      });
    }

    // Convert to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Upload to Cloudinary with enhanced options
    const result = await imageUploadUtil(url, {
      folder: 'ecommerce/products',
      quality: 'auto',
      format: 'auto',
      width: 1200,
      height: 1200,
      crop: 'limit'
    });

    if (!result || !result.url) {
      throw new Error("Cloudinary upload failed");
    }

    res.json({
      success: true,
      result: {
        url: result.url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        thumbnail_url: result.thumbnail_url,
        medium_url: result.medium_url,
        large_url: result.large_url,
        optimized_url: result.optimized_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      },
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image. Please try again."
    });
  }
};

// Bulk image upload handler
const handleBulkImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 files allowed per upload"
      });
    }

    // Convert files to base64
    const files = req.files.map(file => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      return "data:" + file.mimetype + ";base64," + b64;
    });

    // Upload all files
    const results = await bulkImageUpload(files, {
      folder: 'ecommerce/products',
      quality: 'auto',
      format: 'auto'
    });

    res.json({
      success: true,
      results: results.map(result => ({
        url: result.url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        thumbnail_url: result.thumbnail_url,
        medium_url: result.medium_url,
        large_url: result.large_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      })),
      message: `${results.length} images uploaded successfully`
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload images. Please try again."
    });
  }
};

// Image deletion handler
const handleImageDelete = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required"
      });
    }

    const result = await deleteImage(publicId);

    res.json({
      success: true,
      result,
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error("Image deletion error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete image. Please try again."
    });
  }
};

// Image transformation handler
const handleImageTransform = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, crop, gravity, quality, format } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required"
      });
    }

    const transformedUrl = await transformImage(publicId, {
      width: width ? parseInt(width) : 300,
      height: height ? parseInt(height) : 300,
      crop: crop || 'fill',
      gravity: gravity || 'auto',
      quality: quality || 'auto',
      format: format || 'auto'
    });

    res.json({
      success: true,
      transformed_url: transformedUrl,
      message: "Image transformation successful"
    });
  } catch (error) {
    console.error("Image transformation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to transform image. Please try again."
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    console.log(averageReview, "averageReview");

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  handleBulkImageUpload,
  handleImageDelete,
  handleImageTransform,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
