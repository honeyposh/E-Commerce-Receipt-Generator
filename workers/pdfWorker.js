const { Worker } = require("bullmq");
const { cloudQueue } = require("../queue/cloudQueue");
const generatePDF = require("../utils/pdf");
const logger = require("../utils/logger");
const { redisConnection } = require("../redis");
const receiptModel = require("../models/receipt.model");

new Worker(
  "receipt-pdf-queue",
  async (job) => {
    const { receiptId } = job.data;
    const receipt = await receiptModel.findById(receiptId);
    if (!receipt) {
      logger.info(`Receipt not found: ${receiptId}`);
      return;
    }
    try {
      const pdfPath = await generatePDF(receipt);
      logger.info(`PDF generated for order ${receipt.orderId}`);
      await cloudQueue.add(
        "upload-cloud",
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
      return pdfPath;
    } catch (err) {
      logger.error(
        `PDF generation failed for order ${receipt.orderId}: ${err.message}`,
      );
      throw err;
    }
  },
  { connection: redisConnection },
);
