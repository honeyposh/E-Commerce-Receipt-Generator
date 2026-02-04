const { Worker } = require("bullmq");
const { uploadToCloud } = require("../utils/cloudinary");
const logger = require("../utils/logger");
const { redisConnection } = require("../redis");
const { emailQueue } = require("../queue/emailQueue");
const receiptModel = require("../models/receipt.model");

new Worker(
  "receipt-cloud-queue",
  async (job) => {
    const { receiptId, pdfPath } = job.data;
    const receipt = await receiptModel.findById(receiptId);
    if (!receipt) {
      logger.info(`Receipt not found: ${receiptId}`);
      return;
    }
    try {
      const cloudResult = await uploadToCloud(pdfPath);
      await receiptModel.findByIdAndUpdate(receiptId, {
        pdf: cloudResult,
      });
      logger.info(`PDF uploaded to cloud for order ${receipt.orderId}`);
      await emailQueue.add(
        "send-email",
        { receiptId, pdfPath },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    } catch (err) {
      logger.error(
        `Cloud upload failed for order ${receipt.orderId}: ${err.message}`,
      );
      throw err;
    }
  },
  { connection: redisConnection },
);
