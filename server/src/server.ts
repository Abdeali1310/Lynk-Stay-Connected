const express = require("express");
const app = express();
const { connectDB } = require("./utils/db");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const adminRouter = require("./routes/adminRoutes");
const {createServer} = require("http");
const {Server} = require("socket.io")
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

const server = createServer(app);
const io = new Server(server,{});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/admin",adminRouter)


io.on("connection",(socket)=>{
  console.log("user connected - ",socket.id);
  socket.on("disconnect",()=>{
    console.log("user disconnected");
    
  })
  
})
server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectDB(DB_URL);
  
});
