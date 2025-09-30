const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
