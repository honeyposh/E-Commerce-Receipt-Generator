const path = require("path");
const winston = require("winston");
const dailyRotateFile = require("winston-daily-rotate-file");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] ${info.level.toLocaleUpperCase()}: ${info.message}`,
    ),
  ),
  transports: [
    new dailyRotateFile({
      filename: path.join(__dirname, "../logs/error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "10m",
      maxFiles: "2d",
    }),
    new dailyRotateFile({
      filename: path.join(__dirname, "../logs/info-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "info",
      maxSize: "20m",
      maxFiles: "2d",
    }),
    new winston.transports.Console(),
  ],
});
module.exports = logger;
