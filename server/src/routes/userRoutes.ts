const express = require("express");
const {
  userSignUp,
  userLogin,
  getMyProfile,
  userLogout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getAllNotifications,
  getMyFriends,
} = require("../controllers/userController");
import { singleAvatar } from "../middlewares/multer";
const userRouter = express.Router();
const { isAuthenticated } = require("../middlewares/auth");

userRouter.post("/signup", singleAvatar, userSignUp);
userRouter.post("/login", userLogin);

//authenticated routes
userRouter.get("/me", isAuthenticated, getMyProfile);
userRouter.get("/logout", isAuthenticated, userLogout);
userRouter.get("/search", isAuthenticated, searchUser);
userRouter.put("/sendrequest", isAuthenticated, sendFriendRequest);
userRouter.put("/acceptrequest", isAuthenticated, acceptFriendRequest);
userRouter.get("/notifications", isAuthenticated, getAllNotifications);
userRouter.get("/friends", isAuthenticated, getMyFriends);
module.exports = userRouter;
