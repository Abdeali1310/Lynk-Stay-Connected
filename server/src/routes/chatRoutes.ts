const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  newGroupChat,
  getMyChats,
  getMyGroups,
} = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.post("/new", isAuthenticated, newGroupChat);
chatRouter.get("/my", isAuthenticated, getMyChats);
chatRouter.get("/my/groups", isAuthenticated, getMyGroups);

module.exports = chatRouter;
