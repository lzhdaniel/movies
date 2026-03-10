require("dotenv").config();
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const v1Router = require("./routes/v1.router");
const limiter = require("./middleware/rateLimit.middleware");
const morganLogger = require("./middleware/morgan.middleware");
const logger = require("./utils/logger");
const finalErrorHandler = require("./middleware/final.error.middleware");
const PORT = process.env.PORT;

const app = express();

app.use(helmet());
app.use(limiter);
app.use(morganLogger);
app.use(cors());
app.use(express.json());

app.use("/v1", v1Router);

app.use(finalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});
