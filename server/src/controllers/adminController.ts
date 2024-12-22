import { Request, Response } from "express";
import User from "../models/User";
import Chat from "../models/Chat";
import Message from "../models/Message";

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
module.exports = { allUsers, allChats, allMessages, getDashboardStats };
