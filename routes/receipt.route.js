const express = require("express");
const router = express.Router();
const {
  createReceiptController,
  getAllReceipt,
} = require("../controllers/receipt.controller");
const { authentication } = require("../middleware/authMiddleware");

router.post("/receipts", createReceiptController);
router.get("/receipts", authentication, getAllReceipt);

module.exports = router;
