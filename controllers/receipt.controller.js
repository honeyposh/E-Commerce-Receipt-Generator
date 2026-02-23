const { createReceipt } = require("../services/receipt.service");
const receiptModel = require("../models/receipt.model");
const logger = require("../utils/logger");
exports.createReceiptController = async (req, res, next) => {
  try {
    const order = req.body;
    if (!order.orderId || !order.items) {
      logger.info("Invalid order data");
      return res.status(400).json({ message: "Invalid Order data" });
    }
    const receipt = await createReceipt(order, req.user);
    return res.status(201).json({
      message: "Receipt request received",
      receiptId: receipt._id,
    });
  } catch (error) {
    logger.error(`Receipt request failed: ${error.message}`);
    return next(error);
  }
};
exports.getReceipt = async (req, res, next) => {
  const { receiptId } = req.params;
  try {
    const receipt = await receiptModel
      .findById(receiptId)
      .populate("user", "email firstName");

    if (!receipt) {
      const error = new Error("receipt does not exist");
      error.status = 404;
      return next(error);
    }
    if (
      req.user.role !== "business" &&
      receipt.user._id.toString() !== req.user.id
    ) {
      const error = new Error("forbidden: access denied");
      error.status = 403;
      return next(error);
    }

    res.status(200).json({ receipt });
  } catch (error) {
    next(error);
  }
};
exports.getAllReceipt = async (req, res, next) => {
  try {
    if (req.user.role !== "business") {
      const error = new Error("forbidden: access denied");
      error.status = 403;
      return next(error);
    }
    const receipts = await receiptModel.find().sort({ createdAt: -1 });
    res.status(200).json({ receipts });
  } catch (error) {
    next(error);
  }
};
