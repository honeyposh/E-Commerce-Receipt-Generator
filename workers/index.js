const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Workers connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
require("../workers/pdfWorker");
require("../workers/cloudWorker");
require("../workers/emailWorker");
