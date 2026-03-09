const express = require("express");
const cors = require("cors");
const v1Router = require("./routes/v1.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1", v1Router);

app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});