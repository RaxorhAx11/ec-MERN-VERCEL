const express = require("express");

const {
  handleImageUpload,
  handleBulkImageUpload,
  handleImageDelete,
  handleImageTransform,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload, uploadMultiple } = require("../../helpers/cloudinary");

const router = express.Router();

// Image upload routes
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/upload-images", uploadMultiple.array("my_files", 5), handleBulkImageUpload);
router.delete("/delete-image/:publicId", handleImageDelete);
router.get("/transform-image/:publicId", handleImageTransform);

// Product CRUD routes
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
