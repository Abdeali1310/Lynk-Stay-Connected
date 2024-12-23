import Message from "./models/Message";

const express = require("express");
const app = express();
const { connectDB } = require("./utils/db");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const adminRouter = require("./routes/adminRoutes");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  createUser,
  createSingleChats,
  createGroupChats,
  createMessagesInAChat,
} = require("./seeders/user");
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require("./constants/events");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { getSockets } = require("./lib/helper");

const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URL;

const server = createServer(app);
const io = new Server(server, {});
const userSocketIDs = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);

// io.use((socket, next) => {});

io.on("connection", (socket) => {
  const user = {
    _id: "asjba",
    name: "nambo",
  };
  userSocketIDs.set(user._id.toString(), socket.id);

  console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async (data) => {
    console.log("Raw data received:", data);
    console.log("Type of data:", typeof data);
    console.log("Keys in data:", Object.keys(data || {}));
  
    let chatId, members, message;
    
    if (typeof data === "string") {
      const parsedData = JSON.parse(data);
      chatId = parsedData.chatId;
      members = parsedData.members;
      message = parsedData.message;
    } else if (data) {
      ({ chatId, members, message } = data);
    }
  
    console.log("Extracted values:", chatId, message, members);
  
    const messageForRealTime = {
      content: message,
      _id: uuidv4(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const usersSocket = getSockets(members);
    io.to(usersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(usersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
    console.log("New message:", messageForRealTime);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});
server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectDB(DB_URL);
});

module.exports = { userSocketIDs };
