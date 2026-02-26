require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
connectDB();
const userRouter = require("./routes/userRoutes");
const customerRouter = require("./routes/customerRoutes");

app.use(cors());
app.use(express.json());

// Routes
app.use("/", userRouter);
app.use("/", customerRouter);

app.listen(port, () => {
  console.log(`Application is up and running on port ${port}.`);
});
