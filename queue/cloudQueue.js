const { Queue } = require("bullmq");
const { redisConnection } = require("../redis");
const cloudQueue = new Queue("receipt-cloud-queue", {
  connection: redisConnection,
});
module.exports = { cloudQueue };
