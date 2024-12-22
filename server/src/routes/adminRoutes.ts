const express = require("express");
const adminRouter = express.Router();
const {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
} = require("../controllers/adminController");
const { isAdminAuthenticated } = require("../middlewares/auth");
adminRouter.post("/verify", adminLogin);
adminRouter.get("/logout", adminLogout);

adminRouter.use(isAdminAuthenticated);
adminRouter.get("/", getAdminData);
adminRouter.get("/users", allUsers);
adminRouter.get("/chats", allChats);
adminRouter.get("/messages", allMessages);
adminRouter.get("/stats", getDashboardStats);

module.exports = adminRouter;
