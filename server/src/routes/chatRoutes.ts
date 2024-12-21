const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { attachmentsMulter } = require("../middlewares/multer");
const {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChats,
  getMessages,
} = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.post("/new", isAuthenticated, newGroupChat);
chatRouter.get("/my", isAuthenticated, getMyChats);
chatRouter.get("/my/groups", isAuthenticated, getMyGroups);
chatRouter.put("/addmembers", isAuthenticated, addMembers);
chatRouter.delete("/removemember", isAuthenticated, removeMember);
chatRouter.delete("/leave/:id", isAuthenticated, leaveGroup);
chatRouter.post(
  "/message",
  isAuthenticated,
  attachmentsMulter,
  sendAttachments
);

chatRouter.use(isAuthenticated);
chatRouter
  .route("/:id")
  .get(getChatDetails)
  .put(renameGroup)
  .delete(deleteChats);

chatRouter.get("/message/:id",getMessages)
module.exports = chatRouter;
