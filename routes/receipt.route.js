const express = require("express");
const router = express.Router();
const {
  createReceiptController,
  getAllReceipt,
  getReceipt,
} = require("../controllers/receipt.controller");
const { authentication } = require("../middleware/authMiddleware");

router.post("/receipts", authentication, createReceiptController);
router.get("/receipts", authentication, getAllReceipt);
router.get("/receipts/:receiptId", authentication, getReceipt);

module.exports = router;
