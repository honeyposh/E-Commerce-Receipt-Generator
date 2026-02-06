require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const userRoute = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const receiptRoute = require("./routes/receipt.route");
require("../workers/pdfWorker");
require("../workers/cloudWorker");
require("../workers/emailWorker");
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRoute);
app.use("/api", receiptRoute);
app.use((error, req, res, next) => {
  return res
    .status(error.status || 500)
    .json({ message: error.message || "server error" });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Connected to db`);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
