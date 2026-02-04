const Redis = require("ioredis");

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => console.log(" Connected to Redis!"));
redisConnection.on("error", (err) =>
  console.log(" Redis connection error:", err),
);

module.exports = { redisConnection };
