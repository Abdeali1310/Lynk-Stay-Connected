import { Request, Response } from "express";
import User from "../models/User";
import Chat from "../models/Chat";
import Message from "../models/Message";
import { adminLoginSchema } from "../utils/validation";
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const allUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    const transformedUsers = await Promise.all(
      users.map(async ({ name, username, avatar, _id }) => {
        const [groups, friends] = await Promise.all([
          Chat.countDocuments({ groupChat: true, members: _id }),
          Chat.countDocuments({ groupChat: false, members: _id }),
        ]);

        return {
          name,
          username,
          avatar: avatar.url,
          _id,
          groups,
          friends,
        };
      })
    );

    return res.status(200).json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    console.log("Error while retrieving users", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving users",
    });
  }
};

const allChats = async (req: Request, res: Request) => {
  try {
    const chats = await Chat.find({})
      .populate("members", "name avatar")
      .populate("creator", "name avatar");
    const transformedChats = await Promise.all(
      chats.map(async ({ members, _id, groupChat, name, creator }) => {
        const totalMessages = await Message.countDocuments({
          chat: _id,
        });

        return {
          _id,
          groupChat,
          name,
          avatar: members.slice(0, 3).map((member) => member.avatar.url),
          members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
          })),
          creator: {
            name: creator?.name || "None",
            avatar: creator?.avatar.url || "",
          },
          totalMembers: members.length,
          totalMessages,
        };
      })
    );
    return res.status(200).json({
      succcess: true,
      chats: transformedChats,
    });
  } catch (error) {
    console.log("Error while retrieving chats", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving chats",
    });
  }
};

const allMessages = async (req: Request, res: Request) => {
  try {
    const messages = await Message.find({})
      .populate("sender", "name avatar")
      .populate("chat", "groupChat");

    const transformedMessages = messages.map(
      ({ content, attachments, _id, sender, createdAt, chat }) => ({
        _id,
        attachments,
        content,
        createdAt,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar.url,
        },
      })
    );
    return res
      .status(200)
      .json({ success: true, messages: transformedMessages });
  } catch (error) {
    console.log("Error while retrieving messages", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving messages",
    });
  }
};

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
      await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
      ]);

    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
      createdAt: {
        $gte: last7Days,
        $lte: today,
      },
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
      const indexApprox =
        (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
      const index = Math.floor(indexApprox);

      messages[6 - index]++;
    });

    const stats = {
      groupsCount,
      usersCount,
      messagesCount,
      totalChatsCount,
      messagesChart: messages,
    };
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log("Error while retrieving dashboard stats", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving dashboard stats",
    });
  }
};

const adminLogin = async (req: Request, res: Response) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);
    const { secretKey } = validatedData;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "admin_key";

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin key" });
    }

    const token = jwt.sign({ secretKey }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //creating new cookie
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie("admin_auth_token", token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
      secure: true,
    });

    return res.status(201).json({
      msg: `Welcome Admin`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ errors: error.errors.map((e) => e.message) });
    }

    console.error("Error while login admin", error);
    return res.status(500).json({
      success: false,
      message: "Server error while login admin",
    });
  }
};

const adminLogout = async (req: Request, res: Response) => {
  res.clearCookie("admin_auth_token", {
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

const getAdminData = async (req: Request, res: Response) => {
  return res.status(200).json({
    admin: true,
  });
};
module.exports = {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
};
