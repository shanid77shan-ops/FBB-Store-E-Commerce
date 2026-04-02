import UserModel from "../Model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
<<<<<<< HEAD
import { 
  sendOtpEmail, 
  sendOrderConfirmationEmail, 
  sendSellerNewOrderEmail,
  sendPasswordResetEmail,
  sendOrderStatusUpdateEmail 
} from "../Utils/emailService.js";
=======

import emailService from "../Utils/emailService.js";

>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateGuestToken = (deviceId) => {
  return jwt.sign({ deviceId, isGuest: true }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = new UserModel({
      name: username,
      email,
      phone,
      password: hashedPassword,
      emailVerified: false,
      otp,
      otpExpiry,
      cart: [],
      wishlist: [],
      orders: [],
      preferences: {
        region: 'IN',
        currency: 'INR',
        notifications: {
          email: true,
          whatsapp: true,
          sms: false
        }
      },
      isGuest: false,
      deviceId: req.headers['device-id'] || null,
      sessionToken: null
    });

    await user.save();

<<<<<<< HEAD
    const emailSent = await sendOtpEmail(email, otp);
=======
    const emailSent = await emailService.sendOtpEmail(email, otp);
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    
    if (!emailSent) {
      await UserModel.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email"
      });
    }

    const token = generateToken(user._id);
    user.sessionToken = token;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email with OTP.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isGuest: false
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email, isGuest: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id);
    user.sessionToken = token;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isGuest: false
      }
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email, isGuest: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const emailSent = await sendOtpEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to resend OTP"
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, isGuest: false });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id);
    user.sessionToken = token;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isGuest: false
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await UserModel.findOne({ 
      email,
      isGuest: false 
    });

    if (!user) {
      user = new UserModel({
        name,
        email,
        phone: null,
        emailVerified: true,
        otp: null,
        otpExpiry: null,
        cart: [],
        wishlist: [],
        orders: [],
        preferences: {
          region: 'IN',
          currency: 'INR',
          notifications: {
            email: true,
            whatsapp: true,
            sms: false
          }
        },
        isGuest: false,
        deviceId: req.headers['device-id'] || null,
        sessionToken: null
      });
      await user.save();
    }

    const token = generateToken(user._id);
    user.sessionToken = token;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isGuest: false
      }
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

export const getGuestUser = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "Device ID is required"
      });
    }

    let user = await UserModel.findOne({ 
      deviceId, 
      isGuest: true 
    });

    if (!user) {
      user = new UserModel({
        name: `Guest_${Date.now()}`,
        email: null,
        phone: null,
        emailVerified: false,
        otp: null,
        otpExpiry: null,
        cart: [],
        wishlist: [],
        orders: [],
        preferences: {
          region: 'IN',
          currency: 'INR',
          notifications: {
            email: false,
            whatsapp: false,
            sms: false
          }
        },
        isGuest: true,
        deviceId,
        sessionToken: null
      });
      await user.save();
    }

    const token = generateGuestToken(deviceId);
    user.sessionToken = token;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Guest session created",
      token,
      user: {
        id: user._id,
        name: user.name,
        isGuest: true,
        deviceId: user.deviceId
      }
    });
  } catch (error) {
    console.error("Guest user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.userId;

    await UserModel.findByIdAndUpdate(userId, {
      sessionToken: null
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId)
      .select('-password -otp -otpExpiry -__v')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updateData = req.body;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId || decoded.deviceId)
      .select('-password -otp -otpExpiry -__v')
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    if (user.sessionToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Session expired"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// Additional email-related functions
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email, isGuest: false });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

<<<<<<< HEAD
    const emailSent = await sendPasswordResetEmail(email, resetToken);
=======
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset email"
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.userId;
    const { email, whatsapp, sms } = req.body;

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (email !== undefined) user.preferences.notifications.email = email;
    if (whatsapp !== undefined) user.preferences.notifications.whatsapp = whatsapp;
    if (sms !== undefined) user.preferences.notifications.sms = sms;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification preferences updated",
      preferences: user.preferences.notifications
    });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
<<<<<<< HEAD
=======
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses || []
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addressData = req.body;

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    const newAddress = {
      ...addressData,
      _id: new mongoose.Types.ObjectId()
    };

    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address added successfully",
      address: newAddress
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addressId = req.params.id;
    const addressData = req.body;

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...addressData
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addressId = req.params.id;

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addressId = req.params.id;

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully"
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isGuest) {
      return res.status(400).json({
        success: false,
        message: "Guest users cannot change password"
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
};