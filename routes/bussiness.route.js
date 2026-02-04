const express = require("express");
const { authentication } = require("../middleware/authMiddleware");
const { getAllReceipt } = require("../controllers/business.controller");
const route = express.Router();
route.get("/receipts", authentication, getAllReceipt);
module.exports = route;
