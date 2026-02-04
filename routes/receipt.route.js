const express = require("express");
const router = express.Router();
const {
  createReceiptController,
} = require("../controllers/receipt.controller");

router.post("/receipts", createReceiptController);

module.exports = router;
