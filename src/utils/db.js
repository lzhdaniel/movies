const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("DB connected successfully");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", { error });
    process.exit(1);
  }
};

module.exports = connectDB;