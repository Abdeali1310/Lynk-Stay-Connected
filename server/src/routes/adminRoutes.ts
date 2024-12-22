const express = require("express");
const adminRouter = express.Router();
const {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
} = require("../controllers/adminController");

adminRouter.get("/users", allUsers);
adminRouter.get("/chats", allChats);
adminRouter.get("/messages", allMessages);
adminRouter.get("/admin/stats", getDashboardStats);

module.exports = adminRouter;
