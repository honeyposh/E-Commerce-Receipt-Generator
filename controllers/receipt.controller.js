const { createReceipt } = require("../services/receipt.service");
const logger = require("../utils/logger");
exports.createReceiptController = async (req, res, next) => {
  try {
    const order = req.body;
    if (!order) {
      logger.info("Order field is required");
      return res.status(400).json({ message: "Order field is required" });
    }
    const receipt = await createReceipt(order);
    return res.status(202).json({
      message: "Receipt job created",
      receiptId: receipt._id,
    });
  } catch (error) {
    logger.error(`Receipt request failed: ${error.message}`);
    return next(error);
  }
};
