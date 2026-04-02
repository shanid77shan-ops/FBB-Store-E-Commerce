import jwt from "jsonwebtoken";
import SellerModel from "../Model/SellerModel.js";

export const sellerAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await SellerModel.findById(decoded.userId);
    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Seller not found",
      });
    }

    req.sellerId = seller._id;
    req.seller = seller;

    next();
  } catch (error) {
    console.error("Seller auth error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
