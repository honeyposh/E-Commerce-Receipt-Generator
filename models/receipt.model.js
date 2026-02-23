const mongoose = require("mongoose");
const receiptSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [{ name: String, quantity: Number, price: Number, total: Number }],
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number,
    paymentMethod: String,
    date: {
      type: Date,
      default: Date.now,
    },
    pdf: { publicId: String, url: String },
  },
  { timestamps: true },
);
const receiptModel = mongoose.model("Receipt", receiptSchema);
module.exports = receiptModel;
