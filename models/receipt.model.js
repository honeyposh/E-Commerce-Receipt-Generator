const mongoose = require("mongoose");
const receiptSchema = new mongoose.Schema({
  receiptId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },

  name: String,
  email: String,

  items: [{ name: String, quantity: Number, price: Number, total: Number }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  date: {
    type: Date,
  },
  pdf: { publicId: String, url: String },
});
const receiptModel = mongoose.model("Receipt", receiptSchema);
module.exports = receiptModel;
