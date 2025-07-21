import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserType } from "../models/User";
import { TokenPayload } from "../controllers/authController";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export default protect;
