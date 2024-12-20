import { Request, Response } from "express";
import Chat from "../models/Chat";
import User from "../models/User";
const { ALERT, REFETCH_CHATS } = require("../constants/events");
const { emitEvent } = require("../utils/features");
const { getOtherMember } = require("../lib/helper");

const newGroupChat = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;

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
    console.log("Error while creating group", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while creating group" });
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
      message: "You are not allowed to add new members",
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
    
  const chat =await  Chat.findById(chatId);
  
  if (!chat) {
    return res.status(404).json({ success: false, message: "Chat not found" });
  }
  
  if (!chat.groupChat) {
    return res
      .status(400)
      .json({ success: false, message: "This is not a group chat" });
  }

  const remainingMembers = await chat.members.filter(
    (member) => member.toString() !== req.user?.toString()
  );

  if(remainingMembers.length <= 3){
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
    console.log("Error while removing user from group",error);
    return res.status(500).json({success:false,message:"Server error while removing user from group"})
    
  }
};

module.exports = {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
};
