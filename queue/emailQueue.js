const { Queue } = require("bullmq");
const { redisConnection } = require("../redis");
const emailQueue = new Queue("receipt-email-queue", {
  connection: redisConnection,
});
module.exports = { emailQueue };
