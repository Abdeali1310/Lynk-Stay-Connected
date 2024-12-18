import { Request, Response } from "express";
import User from "../models/User";
import { signupSchema } from "../utils/validation";
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");

const userSignUp = async (req: Request, res: Response) => {
  try {
    const { name, username, password, bio, avatar } = req.body;
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
      return res.status(400).json({ errors: error.errors[0].message });
    }

    console.log("Error while creating user", error);
    return res.status(411).json({ msg: error });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

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
      return res.status(400).json({ errors: error.errors[0].message });
    }

    console.log("Error while creating user", error);
    return res.status(500).json({ msg: "Internal server error" });
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
    return res.status(500).json({msg:"User not found"})
  } catch (error) {
    console.log("Error while fetching user", error);
    res.status(500).json({ msg: "Error while fetching current user" });
  }
};


const userLogout = (req:Request,res:Response)=>{
  res.clearCookie("auth_token", {
    httpOnly: true,
    domain: "localhost",
    signed: true,
    path: "/",
  });

  res.status(200).json({
    success:true,
    msg:"Logged out successfully"
  })
}
module.exports = { userSignUp, userLogin, getMyProfile, userLogout };
