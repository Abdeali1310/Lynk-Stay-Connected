import { Request, Response } from "express";
import User from "../models/User";
import { signupSchema } from '../utils/validation';
const jwt = require("jsonwebtoken")
const {z} = require("zod");

const userSignUp = async (req: Request, res: Response) => {
    
    try {
      const { name, username, password, bio, avatar } = (req.body);
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

module.exports = { userSignUp };
