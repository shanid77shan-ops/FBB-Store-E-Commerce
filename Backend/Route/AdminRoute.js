import express from "express";
import { addCategory, getCategory, addSubcategory, getSubCategory, updateTrending, SignUp, login, editCategory, getSellers, updateStatus, getSellerProduct, sellerByid, getProducts, editSubcategory, getOrderStatistics, updatePaymentStatus, getOrderById, getOrders } from "../Controller/AdminController.js";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from 'dotenv';
import { updateOrderStatus } from "../Controller/SellerController.js";

dotenv.config();

const adminRouter = express.Router();

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_KEY || "",
  },
});

const categoryUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "category-fbb",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

const productUpload = multer({
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



adminRouter.post("/add-category", categoryUpload.single('image'), addCategory);
adminRouter.get("/get-category", getCategory);
adminRouter.post("/add-subcategory", categoryUpload.single('image'), addSubcategory);
adminRouter.get("/get-subcategory", getSubCategory);

// adminRouter.post("/add-product", productUpload.fields([
//   { name: 'image1', maxCount: 1 },
//   { name: 'image2', maxCount: 1 },
//   { name: 'image3', maxCount: 1 },
//   { name: 'image4', maxCount: 1 }
// ]), addProduct);

adminRouter.put("/update-trending/:id", updateTrending);

// adminRouter.put("/edit-product/:id", handleProductImages, updateProduct);
adminRouter.post("/register",SignUp)
adminRouter.post("/login",login)
adminRouter.put("/edit-category",categoryUpload.single('image'),editCategory)
adminRouter.put("/edit-subcategory/:id",categoryUpload.single('image'),editSubcategory)
adminRouter.get("/get-sellers",getSellers)
adminRouter.put("/update-status/:id",updateStatus)
adminRouter.get("/get-products/:id",getSellerProduct)
adminRouter.get("/get-seller/:id",sellerByid)
adminRouter.get("/get-products",getProducts)
// Add these routes to adminRouter
adminRouter.get("/orders", getOrders);
adminRouter.get("/orders/:id", getOrderById);
adminRouter.put("/orders/:id/status", updateOrderStatus);
adminRouter.put("/orders/:id/payment-status", updatePaymentStatus);
adminRouter.get("/orders/statistics", getOrderStatistics);

export default adminRouter;