import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

declare global {
  namespace Express {
    interface Request {
      user?: string; 
    }
  }
}
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies["auth_token"];

  if (!token) {
    return res.status(411).json({ msg: "Please login to access this route" });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedData) {
    return res.status(400).json({ msg: "Invalid token" });
  }
  

  req.user = decodedData.id;
  next();
};

const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies["admin_auth_token"];

  if (!token) {
    return res.status(411).json({ msg: "Please verify to access this route" });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedData) {
    return res.status(400).json({ msg: "Invalid token" });
  }
  

  req.admin = decodedData.id;
  next();
};
module.exports = { isAuthenticated, isAdminAuthenticated };
