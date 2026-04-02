import express from "express";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from 'dotenv';
import { 
  SignUp, 
  addProduct, 
  deleteProduct, 
  getProducts, 
  login, 
  resetPassword, 
  updateProduct, 
  updateProfile,
  getSellerOrders,
  updateOrderStatus,
  getSellerDashboardStats,
<<<<<<< HEAD
  getSellerProfile
} from "../Controller/SellerController.js";
=======
  getSellerProfile,
  getSalesReport
} from "../Controller/SellerController.js";
import { sellerAuthMiddleware } from "../Middleware/SellerAuth.js";
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff

dotenv.config();

const SellerRouter = express.Router();

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_KEY || "",
  },
});

const profileImageUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "product-fbb",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `profile-${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

const mediaUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "product-fbb",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.fieldname}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

const handleProductMedia = async (req, res, next) => {
  try {
    const mediaFields = [
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'image3', maxCount: 1 },
      { name: 'image4', maxCount: 1 },
      { name: 'video1', maxCount: 1 },
      { name: 'video2', maxCount: 1 }
    ];
    
    return mediaUpload.fields(mediaFields)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: `Error uploading files: ${err.message}` });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

SellerRouter.post("/register", SignUp);
SellerRouter.post("/login", login);
SellerRouter.post('/reset-password/:userId', resetPassword);

<<<<<<< HEAD
SellerRouter.get('/profile/:id', getSellerProfile);
SellerRouter.put('/update-profile/:userId', profileImageUpload.single('profileImage'), updateProfile);

SellerRouter.post("/add-product", handleProductMedia, addProduct);
SellerRouter.get("/get-products/:id", getProducts);
SellerRouter.put("/edit-product/:id", handleProductMedia, updateProduct);
SellerRouter.delete("/delete-product/:id", deleteProduct);

SellerRouter.get("/orders", getSellerOrders);
SellerRouter.post("/orders/update-status", updateOrderStatus);
SellerRouter.get("/dashboard/stats", getSellerDashboardStats);
=======
SellerRouter.get('/profile/:id',sellerAuthMiddleware, getSellerProfile);
SellerRouter.put('/update-profile/:userId', profileImageUpload.single('profileImage'), updateProfile);

SellerRouter.post("/add-product", handleProductMedia, addProduct);
SellerRouter.get("/get-products/:id",sellerAuthMiddleware ,getProducts);
SellerRouter.put("/edit-product/:id", handleProductMedia, updateProduct);
SellerRouter.delete("/delete-product/:id", deleteProduct);

SellerRouter.get("/orders",sellerAuthMiddleware, getSellerOrders);
SellerRouter.post("/orders/update-status",sellerAuthMiddleware, updateOrderStatus);
SellerRouter.get("/dashboard/stats",sellerAuthMiddleware, getSellerDashboardStats);
SellerRouter.get("/sales-report",sellerAuthMiddleware, getSalesReport);
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff

export default SellerRouter;