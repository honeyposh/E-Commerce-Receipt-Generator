const { Queue } = require("bullmq");
const { redisConnection } = require("../redis");
const pdfQueue = new Queue("receipt-pdf-queue", {
  connection: redisConnection,
});
module.exports = { pdfQueue };
