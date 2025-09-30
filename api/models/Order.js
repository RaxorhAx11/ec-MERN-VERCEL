const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      title: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  addressInfo: {
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  orderStatus: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'inProcess', 'inShipping', 'delivered', 'cancelled', 'rejected'] },
  paymentMethod: { type: String, default: 'paypal', enum: ['paypal', 'cod', 'mock'] },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed', 'refunded'] },
  totalAmount: { type: Number, required: true, min: 0 },
  orderDate: { type: Date, default: Date.now },
  orderUpdateDate: { type: Date, default: Date.now },
  paymentId: { type: String, default: null },
  payerId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
