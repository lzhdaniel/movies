const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 1,
  skip: () => process.env.NODE_ENV === "dev",
});

module.exports = limiter;
