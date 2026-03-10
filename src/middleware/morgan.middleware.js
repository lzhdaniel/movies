const morgan = require("morgan");
const logger = require("../utils/logger");

const morganLogger = morgan(process.env.NODE_ENV !== "dev" ? "combined" : "dev", {
  stream: { write: (message) => logger.info(message.trim()) },
});

module.exports = morganLogger;
