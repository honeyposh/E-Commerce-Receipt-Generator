const { createReceipt } = require("../services/receipt.service");
const receiptModel = require("../models/receipt.model");
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
      message: "Receipt request received",
      receiptId: receipt._id,
    });
  } catch (error) {
    logger.error(`Receipt request failed: ${error.message}`);
    return next(error);
  }
};
exports.getAllReceipt = async (req, res, next) => {
  console.log(req.user.role);
  console.log(req.user.role !== "business");
  try {
    if (req.user.role !== "business") {
      const error = new Error("forbidden: access denied");
      error.status = 403;
      return next(error);
    }
    const receipts = await receiptModel.find();

    if (!receipts) {
      const error = new Error("receipt doesnot exist");
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ receipts });
  } catch (error) {
    next(error);
  }
};
