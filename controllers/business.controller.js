const receiptModel = require("../models/receipt.model");
exports.getAllReceipt = async (req, res, next) => {
  console.log(req.user.role);
  console.log(req.user.role !== "business");
  try {
    if (req.user.role !== "business") {
      const error = new Error("forbidden access denied");
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
