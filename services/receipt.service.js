const receiptModel = require("../models/receipt.model");
const logger = require("../utils/logger");
const { pdfQueue } = require("../queue/pdfQueue");
async function createReceipt(order) {
  const existingReceipt = await receiptModel.findOne({
    orderId: order.orderId,
  });
  if (existingReceipt) {
    logger.info(` Receipt already exists for order ${order.orderId}`);
    return existingReceipt;
  }
  const receipt = await receiptModel.create({
    orderId: order.orderId,
    name: order.name,
    email: order.email,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })),
    subtotal: order.subtotal,
    tax: order.tax || 0,
    discount: order.discount || 0,
    total: order.total,
    paymentMethod: order.paymentMethod,
    date: new Date(),
  });
  await pdfQueue.add(
    "generate-pdf",
    { receiptId: receipt._id },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  );
  return receipt;
}
module.exports = { createReceipt };
