import express from "express";
const UserRoute = express.Router();
import dotenv from 'dotenv';
import { 
    ProductType, 
    getCategory, 
    getDetails, 
    getProduct, 
    getSellers, 
    getSubCategories, 
    getSubCategory, 
    relatedProduct,
    getProductsByType,
    getProductsBySeller,
    clearCacheHandler,
} from "../Controller/UserController.js";

import {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCart,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    moveToCart,
    getCartSummary,
    getCartBySeller
} from "../Controller/CartController.js";

import {
    register,
    login,
    googleAuth,
    getGuestUser,
    logout,
    getProfile,
    updateProfile,
    verifyToken,
    verifyEmail,
    resendOtp,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    updatePassword
} from "../Controller/AuthController.js";

import {
    createOrder,
    verifyPayment,
    getOrder,
    getUserOrders,
    cancelOrder,
    cancelOrderItem,
    updateOrderStatus,
    getOrderDetails,
    requestReturn,
    trackOrder,
} from "../Controller/OrderController.js";

import { authMiddleware } from "../Middleware/Auth.js";

dotenv.config();

UserRoute.post("/register", register);
UserRoute.post("/login", login);
UserRoute.post("/verify-email", verifyEmail);
UserRoute.post("/resend-otp", resendOtp);
UserRoute.post("/google-auth", googleAuth);
UserRoute.post("/guest", getGuestUser);
UserRoute.post("/logout", authMiddleware, logout);
UserRoute.get("/profile", authMiddleware, getProfile);
UserRoute.put("/profile", authMiddleware, updateProfile);
UserRoute.get("/verify-token", verifyToken);

UserRoute.get("/products", getProduct);
UserRoute.get("/product/:id", getDetails);
UserRoute.get("/products/type/:type/:subCategoryId?/:sellerId?", getProductsByType);
UserRoute.get("/products/seller/:sellerId", getProductsBySeller);
UserRoute.get("/products/related/:seller/:category", relatedProduct);

UserRoute.get("/categories/:id", getCategory);
UserRoute.get("/subcategories/:id", getSubCategories);
UserRoute.get("/subcategory/:id/:category", getSubCategory);
UserRoute.get("/types/:id", ProductType);

UserRoute.get("/sellers", getSellers);

UserRoute.post("/cart/add", authMiddleware, addToCart);
UserRoute.put("/cart/update", authMiddleware, updateCartItem);
UserRoute.delete("/cart/remove/:cartItemId", authMiddleware, removeFromCart);
UserRoute.delete("/cart/clear", authMiddleware, clearCart);
UserRoute.get("/cart", authMiddleware, getCart);
UserRoute.get("/cart/summary", authMiddleware, getCartSummary);
UserRoute.get("/cart/by-seller", authMiddleware, getCartBySeller);

UserRoute.post("/wishlist/add", authMiddleware, addToWishlist);
UserRoute.delete("/wishlist/remove/:productId", authMiddleware, removeFromWishlist);
UserRoute.get("/wishlist", authMiddleware, getWishlist);
UserRoute.post("/wishlist/move-to-cart", authMiddleware, moveToCart);

UserRoute.post("/order/create", authMiddleware, createOrder);
UserRoute.post("/payment/verify", authMiddleware, verifyPayment);
UserRoute.get("/orders", authMiddleware, getUserOrders);
UserRoute.get("/order/:orderId", authMiddleware, getOrder);
UserRoute.get("/order/:orderId/details", authMiddleware, getOrderDetails);
UserRoute.post("/order/:orderId/cancel", authMiddleware, cancelOrder);
UserRoute.post("/order/:orderId/cancel-item", authMiddleware, cancelOrderItem);
UserRoute.post("/order/:orderId/return", authMiddleware, requestReturn);
UserRoute.get("/order/:orderId/track", authMiddleware, trackOrder);
UserRoute.post("/order/update-status", authMiddleware, updateOrderStatus);

UserRoute.get("/profile/addresses", authMiddleware, getAddresses);
UserRoute.post("/profile/addresses", authMiddleware, addAddress);
UserRoute.put("/profile/addresses/:id", authMiddleware, updateAddress);
UserRoute.delete("/profile/addresses/:id", authMiddleware, deleteAddress);
UserRoute.put("/profile/addresses/:id/default", authMiddleware, setDefaultAddress);
UserRoute.put("/profile/password", authMiddleware, updatePassword);
UserRoute.get("/clear-cache", clearCacheHandler);

UserRoute.get("/get-product", getProduct);
UserRoute.get("/get-category/:id", getCategory);
UserRoute.get("/get-subcategories/:id", getSubCategories);
UserRoute.get("/get-product/:id", getDetails);
UserRoute.get("/get-subcategory/:id/:category", getSubCategory);
UserRoute.get("/get-type/:id", ProductType);
UserRoute.get("/get-related/:seller/:category", relatedProduct);
UserRoute.get("/get-sellers", getSellers);
UserRoute.get("/cart/by-seller", authMiddleware, getCartBySeller);

export default UserRoute;