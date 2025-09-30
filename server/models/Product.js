const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, index: true },
    brand: { type: String, index: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: 0, min: 0 },
    totalStock: { type: Number, required: true, min: 0 },
    averageReview: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model("Product", ProductSchema);
