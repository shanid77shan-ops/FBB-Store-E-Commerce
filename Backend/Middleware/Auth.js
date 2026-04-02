import jwt from "jsonwebtoken";
import UserModel from "../Model/UserModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.isGuest) {
      user = await UserModel.findOne({ 
        deviceId: decoded.deviceId,
        isGuest: true 
      });
      req.isGuest = true;
    } else {
      user = await UserModel.findById(decoded.userId);
      req.isGuest = false;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.sessionToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Session expired"
      });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};