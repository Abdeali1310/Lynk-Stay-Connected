const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
} = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.post("/new", isAuthenticated, newGroupChat);
chatRouter.get("/my", isAuthenticated, getMyChats);
chatRouter.get("/my/groups", isAuthenticated, getMyGroups);
chatRouter.put("/addmembers", isAuthenticated, addMembers);
chatRouter.delete("/removemember", isAuthenticated, removeMember);

module.exports = chatRouter;
