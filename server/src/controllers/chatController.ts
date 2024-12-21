import { Request, Response } from "express";
import Chat from "../models/Chat";
import User from "../models/User";
import Message from "../models/Message";
const {
  ALERT,
  REFETCH_CHATS,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
} = require("../constants/events");
const { emitEvent } = require("../utils/features");
const { getOtherMember } = require("../lib/helper");
const { deleteFilesFromCloudinary } = require("../utils/features");
const { newGroupValidator } = require("../utils/validation");

const newGroupChat = async (req: Request, res: Response) => {
  try {
    const validateNewGroupChat = newGroupValidator.parse(req.body);
    const { name, members } = validateNewGroupChat;

    if (members.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Group chat must have atleast 3 members",
      });
    }

    const allMembers = [...members, req.user];

    const chat = await Chat.create({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      success: true,
      message: "Group Created",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }

    console.error("Error creating new group", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating new group",
    });
  }
};

const getMyChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({ members: req.user }).populate(
      "members",
      "name avatar"
    );

    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
      const otherMember = getOtherMember(members, req.user);

      return {
        _id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMember.avatar.url],
        name: groupChat ? name : otherMember.name,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    return res.status(201).json({
      success: true,
      chats: transformedChats,
    });
  } catch (error) {
    console.log("Error while retrieving chats ", error);
    res
      .status(500)
      .json({ success: false, message: "Error while retrieving chats" });
  }
};

const getMyGroups = async (req: Request, res: Response) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
};

const addMembers = async (req: Request, res: Response) => {
  try {
    const { chatId, members } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    if (!members || members.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide members" });
    }
    if (!chat.groupChat) {
      return res
        .status(400)
        .json({ success: false, message: "This is not a group chat" });
    }

    if (chat.creator.toString() !== req.user?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add new members",
      });
    }

    const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
    const allNewMembers = await Promise.all(allNewMembersPromise);

    const uniqueMembers = allNewMembers
      .filter((i) => !chat.members.includes(i._id.toString()))
      .map((i) => i._id);

    chat.members.push(...uniqueMembers);

    if (chat.members.length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Group members limit reached" });
    }

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(",");

    emitEvent(
      req,
      ALERT,
      chat.members,
      `${allUsersName} have been added to the group`
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
      .status(200)
      .json({ success: true, message: "Members Added successfully" });
  } catch (error) {
    console.log("Error while adding new members to group", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding new members to group",
    });
  }
};

const removeMember = async (req: Request, res: Response) => {
  const { userId, chatId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);
  if (!chat) {
    return res.status(404).json({ success: false, message: "Chat not found" });
  }
  if (chat.creator.toString() !== req.user?.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to remove new members",
    });
  }
  if (!chat.groupChat) {
    return res
      .status(400)
      .json({ success: false, message: "This is not a group chat" });
  }

  if (chat.members.length <= 3) {
    return res
      .status(400)
      .json({ success: false, message: "Group must have atleast 3 members" });
  }

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved.name} has been removed form the group`
  );
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res
    .status(200)
    .json({ success: true, message: "Member removed successfully" });
};

const leaveGroup = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    if (!chat.groupChat) {
      return res
        .status(400)
        .json({ success: false, message: "This is not a group chat" });
    }

    const remainingMembers = await chat.members.filter(
      (member) => member.toString() !== req.user?.toString()
    );

    if (remainingMembers.length <= 3) {
      return res
        .status(400)
        .json({ success: false, message: "Group must have atleast 3 members" });
    }
    if (chat.creator.toString() === req.user?.toString()) {
      const randomElement = Math.floor(Math.random() * remainingMembers.length);
      const newCreator = remainingMembers[randomElement];
      chat.creator = newCreator;
    }

    chat.members = remainingMembers;

    const [user] = await Promise.all([
      User.findById(req.user, "name"),
      chat.save(),
    ]);

    return res
      .status(200)
      .json({ success: true, message: "User removed successfully" });
  } catch (error) {
    console.log("Error while removing user from group", error);
    return res.status(500).json({
      success: false,
      message: "Server error while removing user from group",
    });
  }
};

const sendAttachments = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.body;

    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.user, "name"),
    ]);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    const files = req.files || [];
    if (files.length < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide attachments" });
    }

    const attachments = [];

    const messageForRealTime = {
      content: "",
      attachments,
      sender: { id: me._id, name: me.name },
      chat: chatId,
    };

    const messageForDB = {
      content: "",
      attachments,
      sender: me._id,
      chat: chatId,
    };
    const message = await Message.create(messageForDB);
    emitEvent(req, NEW_ATTACHMENT, chat.members, {
      message: messageForRealTime,
      chatId,
    });
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
    return res.status(200).json({ success: true, message: message });
  } catch (error) {
    console.log("Error while sending attachments", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending attachments",
    });
  }
};

const getChatDetails = async (req: Request, res: Response) => {
  try {
    if (req.query.populate === "true") {
      const chat = await Chat.findById(req.params.id)
        .populate("members", "name avatar")
        .lean();

      if (!chat) {
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });
      }

      chat.members = chat.members.map(({ _id, name, avatar }) => {
        return {
          _id,
          name,
          avatar: avatar.url,
        };
      });

      return res.status(200).json({ success: true, chat });
    } else {
      const chat = await Chat.findById(req.params.id);
      if (!chat) {
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });
      }

      return res.status(200).json({ success: true, chat });
    }
  } catch (error) {
    console.log("Error while retrieving chats", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving chats",
    });
  }
};

const renameGroup = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    const { name } = req.body;
    console.log(name);

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    if (chat.creator.toString() !== req.user?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to rename group",
      });
    }
    if (!chat.groupChat) {
      return res
        .status(400)
        .json({ success: false, message: "This is not a group chat" });
    }
    chat.name = name;
    await chat.save();
    console.log(chat);

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Group name changed successfully",
    });
  } catch (error) {
    console.log("Error while renaming group", error);
    return res.status(500).json({
      success: false,
      message: "Server error while renaming group",
    });
  }
};

const deleteChats = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    const members = chat.members;

    if (chat.groupChat && chat.creator.toString() !== req.user?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete the group",
      });
    }

    if (!chat.groupChat && !chat.members.includes(req.user?.toString())) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete the chat",
      });
    }

    const messagesWithAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];

    messagesWithAttachments.forEach(({ attachments }) =>
      attachments.forEach(({ pubilc_id }) => public_ids.push(pubilc_id))
    );

    await Promise.all([
      deleteFilesFromCloudinary(public_ids),
      chat.deleteOne(),
      Message.deleteMany({ chat: chatId }),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res
      .status(200)
      .json({ success: true, message: "Chats deleted successfully" });
  } catch (error) {
    console.log("Error while deleting chats", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting chats",
    });
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const { page = 1 } = req.query || 1;

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;
    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages,
    });
  } catch (error) {
    console.error("Error while retrieving chats", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving chats",
    });
  }
};

module.exports = {
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
};
