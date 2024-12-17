const express = require("express");
const app = express();
const { connectDB } = require("./utils/db");
const userRouter = require("./routes/userRoutes");
const cookieParser =  require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectDB(DB_URL);
});