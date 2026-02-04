const { Worker } = require("bullmq");
const logger = require("../utils/logger");
const { redisConnection } = require("../redis");
const sendReceiptEmail = require("../utils/mailer");
const receiptModel = require("../models/receipt.model");
const fs = require("fs").promises;

new Worker(
  "receipt-email-queue",
  async (job) => {
    const { receiptId, pdfPath } = job.data;
    const receipt = await receiptModel.findById(receiptId);
    if (!receipt) {
      logger.info(`Receipt not found: ${receiptId}`);
      return;
    }
    try {
      await sendReceiptEmail(receipt, pdfPath, true);
      logger.info(`Receipt email sent for order ${receipt.orderId}`);
      try {
        await fs.unlink(pdfPath);
        logger.info(`PDF deleted for order ${receipt.orderId}`);
      } catch (error) {
        logger.error(`Couldnt delete pdf for order {receipt.orderId}`);
      }
    } catch (err) {
      logger.error(
        `Email sending failed for order ${receipt.orderId}: ${err.message}`,
      );
      throw err;
    }
  },
  { connection: redisConnection },
);
