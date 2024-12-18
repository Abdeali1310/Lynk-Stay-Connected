import { Request, Response } from "express";
import Chat from "../models/Chat";
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
module.exports = { newGroupChat, getMyChats, getMyGroups };
