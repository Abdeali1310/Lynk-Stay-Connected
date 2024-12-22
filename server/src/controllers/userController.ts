import { Request, Response } from "express";
import User from "../models/User";
import { loginSchema, signupSchema } from "../utils/validation";
import Chat from "../models/Chat";
import Req from "../models/Request";
const { emitEvent } = require("../utils/features");
const { NEW_REQUEST, REFETCH_CHATS } = require("../constants/events");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const {getOtherMember} = require("../lib/helper")

const userSignUp = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { name, username, password, bio, avatar } = validatedData;
    const user = await User.create({
      name,
      username,
      password,
      bio,
      avatar,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      //creating new cookie
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);

      res.cookie("auth_token", token, {
        path: "/",
        domain: "localhost",
        expires,
        httpOnly: true,
        signed: true,
        secure: true,
      });

      return res.status(201).json({
        user: user._id,
        name: user.name,
        token: token,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ errors: error.errors.map((e) => e.message) });
    }

    console.error("Error while creating user", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating user",
    });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "Username not found" });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      //creating new cookie
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);

      res.cookie("auth_token", token, {
        path: "/",
        domain: "localhost",
        expires,
        httpOnly: true,
        signed: true,
        secure: true,
      });

      return res.status(201).json({
        msg: `Welcome back, ${user.name}`,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ errors: error.errors.map((e) => e.message) });
    }

    console.error("Error while login user", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating user",
    });
  }
};

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);

    if (user) {
      return res.status(200).json({
        user,
      });
    }
    return res.status(500).json({ msg: "User not found" });
  } catch (error) {
    console.log("Error while fetching user", error);
    res.status(500).json({ msg: "Error while fetching current user" });
  }
};

const userLogout = (req: Request, res: Response) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    domain: "localhost",
    signed: true,
    path: "/",
  });

  res.status(200).json({
    success: true,
    msg: "Logged out successfully",
  });
};

const searchUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    const myChats = await Chat.find({ groupChat: false, members: req.user });

    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    const allUsersExceptMeAndFriend = await User.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" },
    });

    const users = allUsersExceptMeAndFriend.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error while searching user", error);

    return res.status(500).json({
      success: false,
      message: "Server error while searching user",
    });
  }
};

const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const request = await Req.findOne({
      $or: [
        {
          sender: req.user,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user,
        },
      ],
    });

    if (request) {
      return res
        .status(400)
        .json({ success: false, message: "Request already sent" });
    }
    await Req.create({
      sender: req.user,
      receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
      success: true,
      message: "Friend request sent",
    });
  } catch (error) {
    console.log("Error while sending friend request", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending friend request",
    });
  }
};

const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { requestId, accept } = req.body;

    const request = await Req.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.receiver._id.toString() !== req.user?.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to accept this request",
      });
    }

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend request rejected",
      });
    }
    const members = [request.sender._id, request.receiver._id];
    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    console.log("Error while accepting friend request", error);

    return res.status(500).json({
      success: false,
      message: "Server error while accepting friend request",
    });
  }
};

const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const requests = await Req.find({
      receiver: req.user,
    }).populate("sender", "name avatar");

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      allRequests,
    });
  } catch (error) {
    console.log("Error while retrieving notifications", error);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving notifications",
    });
  }
};

const getMyFriends = async (req:Request,res:Response)=>{
  try {
    const chatId = req.query.chatId;

    const chats = await Chat.find({
      members:req.user,
      groupChat:false,
    }).populate("members","name avatar");

    const friends = chats.map(({members})=>{
      const otherUser = getOtherMember(members,req.user)

      return {
        _id:otherUser._id,
        name:otherUser.name,
        avatar:otherUser.avatar.url
      }
    })

    if(chatId){
      const chat = await Chat.findById(chatId);
      const availableFriends = friends.filter(
        (friend)=>!chat.members.includes(friend._id)
      );

      return res.status(200).json({
        success:true,
        friends:availableFriends,
      })
    }else{
      return res.status(200).json({
        success:true,
        friends,
      })
    }
  } catch (error) {
    console.log("Error while retrieving friends", error);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving friends",
    });
  }
}
module.exports = {
  userSignUp,
  userLogin,
  getMyProfile,
  userLogout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getAllNotifications,
  getMyFriends,
};
