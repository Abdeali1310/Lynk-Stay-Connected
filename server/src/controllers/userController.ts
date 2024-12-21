import { Request, Response } from "express";
import User from "../models/User";
import { loginSchema, signupSchema } from "../utils/validation";
import Chat from "../models/Chat";
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");

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
};

module.exports = {
  userSignUp,
  userLogin,
  getMyProfile,
  userLogout,
  searchUser,
};
