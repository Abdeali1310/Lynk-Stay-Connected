const express = require("express");
const app = express();
const { connectDB } = require("./utils/db");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const adminRouter = require("./routes/adminRoutes");
const {
  createUser,
  createSingleChats,
  createGroupChats,
  createMessagesInAChat,
} = require("./seeders/user");

const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/admin",adminRouter)

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectDB(DB_URL);
  // createUser(10);
  // createSingleChats(10)
  // createGroupChats(10);

  // createMessagesInAChat("6766f0dd008d409af7bde4dc", 50);
});
