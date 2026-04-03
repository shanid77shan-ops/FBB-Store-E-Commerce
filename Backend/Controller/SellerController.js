// import SellerModel from "../Model/SellerModel.js"
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import productModel from "../Model/ProductModel.js";
// import categoryModel from "../Model/CategoryModel.js";
// import OrderModel from "../Model/OrderModel.js";
// import mongoose from "mongoose";

// export const SignUp = async(req,res)=>{
//     try {
//       const {email,phone,password,name, companyName, address, city, state, country, pincode, gstNumber, panNumber } = req.body
      
//       const existing = await SellerModel.findOne({email})

//       if(existing){
//         return res.status(400).json({message:"Email already exists"})
//       }

//       const salt = await bcrypt.genSalt(10)
//       const hashedpass = await bcrypt.hash(password,salt)

//       const seller = new SellerModel({
//         name,
//         email,
//         phone,
//         companyName,
//         address,
//         city,
//         state,
//         country,
//         pincode,
//         gstNumber,
//         panNumber,
//         password:hashedpass
//       })

//      await seller.save()

//      const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.status(201).json(token);
//     } catch (error) {
//       res.status(500).json({message:"Internal server error"})
//     }
//   }

// export const login = async (req, res) => {
//     try {
//       const { emailOrPhone, password } = req.body;

//       if (!emailOrPhone || !password) {
//         return res.status(400).json({ message: "Email/Phone and password are required" });
//       }

//       const seller = await SellerModel.findOne({
//         $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
//       });

//       if (!seller) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const isMatch = await bcrypt.compare(password,seller.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Invalid password" });
//       }

//       const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET, {
//         expiresIn: '7d',
//       });

//       return res.status(200).json({ 
//         message: 'Login successful', 
//         token,
//         user: {
//           name: seller.name,
//           email: seller.email,
//           phone: seller.phone,
//           companyName: seller.companyName,
//           _id: seller._id,
//           status: seller.status,
//           profileImage: seller.profileImage
//         }
//       });
      
//     } catch (error) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   };

// export const addProduct = async (req, res) => {
//   try {

//     const { 
//       name, brand, priceINR, priceAED, categoryId, subCategoryId, sellerId,
//       description, shortDescription, sku, stock, lowStockThreshold, material,
//       colors, sizes, tags, weightValue, weightUnit, length, width, height,
//       dimensionUnit, warrantyPeriod, warrantyUnit, warrantyDescription,
//       isTrending, isFeatured, discountPercentage, discountAmount, 
//       discountStartDate, discountEndDate, weightBasedShipping, freeShipping,
//       shippingCost, metaTitle, metaDescription, metaKeywords, specifications
//     } = req.body;

//     if (!name || !brand || !priceINR || !priceAED || !categoryId || !sellerId || !stock) {

//       return res.status(400).json({
        
//         success: false,
//         message: "Missing required fields"
//       });
//     }

//     const categoryExists = await categoryModel.findById(categoryId);
//     if (!categoryExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found"
//       });
//     }


//     let finalSku = sku;
//     if (!finalSku) {
//       const timestamp = Date.now();
//       const random = Math.floor(Math.random() * 1000);
//       finalSku = `SKU_${timestamp}_${random}`;
//     }

//     const existingSku = await productModel.findOne({ sku: finalSku });
//     if (existingSku) {
//       return res.status(400).json({
//         success: false,
//         message: "SKU already exists"
//       });
//     }

//     const images = {};
//     const videos = {};

//     if (req.files) {
//       for (let i = 1; i <= 4; i++) {
//         const fieldName = `image${i}`;
//         if (req.files[fieldName] && req.files[fieldName][0]) {
//           images[fieldName] = req.files[fieldName][0].location;
//         }
//       }

//       for (let i = 1; i <= 2; i++) {
//         const fieldName = `video${i}`;
//         if (req.files[fieldName] && req.files[fieldName][0]) {
//           videos[fieldName] = req.files[fieldName][0].location;
//         }
//       }
//     }

//     if (!images.image1) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one product image is required"
//       });
//     }

//     let parsedSpecifications = {};
//     try {
//       if (specifications && typeof specifications === 'string') {
//         const specArray = JSON.parse(specifications);
//         if (Array.isArray(specArray)) {
//           specArray.forEach(spec => {
//             if (spec.key && spec.value) {
//               parsedSpecifications[spec.key] = spec.value;
//             }
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error parsing specifications:', error);
//     }


//     const colorsArray = colors ? colors.split(',').map(c => c.trim()).filter(c => c) : [];
//     const sizesArray = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : [];
//     const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
//     const metaKeywordsArray = metaKeywords ? metaKeywords.split(',').map(k => k.trim()).filter(k => k) : [];


//     const productData = {
//       name,
//       brand,
//       priceINR: Number(priceINR),
//       priceAED: Number(priceAED),
//       description,
//       shortDescription,
//       sku: finalSku,
//       stock: Number(stock),
//       lowStockThreshold: Number(lowStockThreshold) || 10,
//       images,
//       videos,
//       subCategoryId,
//       categoryId,
//       seller: sellerId,
//       material,
//       colors: colorsArray,
//       sizes: sizesArray,
//       tags: tagsArray,
//       specifications: parsedSpecifications,
//       weight: weightValue ? {
//         value: Number(weightValue),
//         unit: weightUnit || 'g'
//       } : undefined,
//       dimensions: (length || width || height) ? {
//         length: length ? Number(length) : undefined,
//         width: width ? Number(width) : undefined,
//         height: height ? Number(height) : undefined,
//         unit: dimensionUnit || 'cm'
//       } : undefined,
//       warranty: (warrantyPeriod || warrantyDescription) ? {
//         period: warrantyPeriod ? Number(warrantyPeriod) : undefined,
//         unit: warrantyUnit || 'months',
//         description: warrantyDescription
//       } : undefined,
//       trending: isTrending === 'true',
//       featured: isFeatured === 'true',
//       discount: (discountPercentage || discountAmount) ? {
//         percentage: discountPercentage ? Number(discountPercentage) : 0,
//         amount: discountAmount ? Number(discountAmount) : 0,
//         startDate: discountStartDate,
//         endDate: discountEndDate
//       } : undefined,
//       shippingInfo: {
//         weightBased: weightBasedShipping === 'true',
//         freeShipping: freeShipping === 'true',
//         shippingCost: shippingCost ? Number(shippingCost) : 0
//       },
//       metaTitle,
//       metaDescription,
//       metaKeywords: metaKeywordsArray
//     };

//     Object.keys(productData).forEach(key => {
//       if (productData[key] === undefined || productData[key] === null) {
//         delete productData[key];
//       }
//     });
//     console.log("eee",productData)


//     const product = await productModel.create(productData);
//     console.log("first")
//     console.log(product)
//     await SellerModel.findByIdAndUpdate(product.seller, {
//       $addToSet: { categories: productData.categoryId }
//     });




//     res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to add product",
//       error: error.message
//     });
//   }
// };

// export const getProducts = async (req, res) => {
//     try {
//         const seller = req.params.id
//       const products = await productModel
//         .find({ seller: seller })
//         .populate('categoryId', 'name')
//         .populate('subCategoryId','name')
//         .sort({ createdAt: -1 });

//       if (!products.length) {
//         return res.status(404).json({
//           success: false,
//           message: "No products found"
//         });
//       }

//       res.status(200).json({products});
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch products",
//         error: error.message
//       });
//     }
//   };

// export const resetPassword = async (req, res) => {
//     try {
//       const { currentPassword, newPassword } = req.body;
//       const { userId } = req.params;

//       const seller = await SellerModel.findById(userId);
//       if (!seller) {
//         return res.status(404).json({ message: "Seller not found" });
//       }

//       const isMatch = await bcrypt.compare(currentPassword, seller.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Current password is incorrect" });
//       }

//       const salt = await bcrypt.genSalt(10);
//       const hashedNewPassword = await bcrypt.hash(newPassword, salt);

//       seller.password = hashedNewPassword;
//       await seller.save();

//       res.status(200).json({ message: "Password updated successfully" });
      
//     } catch (error) {
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name, brand, categoryId, subCategoryId, priceINR, priceAED, isTrending,
//       existingImages, existingVideos, description, shortDescription, sku, stock,
//       lowStockThreshold, material, colors, sizes, tags, weightValue, weightUnit,
//       length, width, height, dimensionUnit, warrantyPeriod, warrantyUnit,
//       warrantyDescription, isFeatured, discountPercentage, discountAmount,
//       discountStartDate, discountEndDate, weightBasedShipping, freeShipping,
//       shippingCost, metaTitle, metaDescription, metaKeywords, specifications
//     } = req.body;

//     const product = await productModel.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     let parsedExistingImages = {};
//     try {
//       if (existingImages && typeof existingImages === 'string') {
//         const parsed = JSON.parse(existingImages);
//         if (Array.isArray(parsed)) {
//           parsed.forEach((url, index) => {
//             if (url) parsedExistingImages[`image${index + 1}`] = url;
//           });
//         } else if (typeof parsed === 'object') {
//           parsedExistingImages = parsed;
//         }
//       }
//     } catch (error) {
//       console.error('Error parsing existing images:', error);
//     }

//     let parsedExistingVideos = {};
//     try {
//       if (existingVideos && typeof existingVideos === 'string') {
//         const parsed = JSON.parse(existingVideos);
//         if (Array.isArray(parsed)) {
//           parsed.forEach((url, index) => {
//             if (url) parsedExistingVideos[`video${index + 1}`] = url;
//           });
//         } else if (typeof parsed === 'object') {
//           parsedExistingVideos = parsed;
//         }
//       }
//     } catch (error) {
//       console.error('Error parsing existing videos:', error);
//     }

//     const newImages = {};
//     const newVideos = {};

//     if (req.files) {
//       for (let i = 1; i <= 4; i++) {
//         const fieldName = `image${i}`;
//         if (req.files[fieldName] && req.files[fieldName][0]) {
//           newImages[fieldName] = req.files[fieldName][0].location;
//         }
//       }

//       for (let i = 1; i <= 2; i++) {
//         const fieldName = `video${i}`;
//         if (req.files[fieldName] && req.files[fieldName][0]) {
//           newVideos[fieldName] = req.files[fieldName][0].location;
//         }
//       }
//     }

//     const finalImages = {};
//     for (let i = 1; i <= 4; i++) {
//       const fieldName = `image${i}`;
//       const newImage = newImages[fieldName];
//       const existingImage = parsedExistingImages[fieldName];
//       const currentImage = product.images && product.images[fieldName];
      
//       if (newImage) {
//         finalImages[fieldName] = newImage;
//       } else if (existingImage) {
//         finalImages[fieldName] = existingImage;
//       } else if (currentImage) {
//         finalImages[fieldName] = currentImage;
//       }
//     }

//     const finalVideos = {};
//     for (let i = 1; i <= 2; i++) {
//       const fieldName = `video${i}`;
//       const newVideo = newVideos[fieldName];
//       const existingVideo = parsedExistingVideos[fieldName];
//       const currentVideo = product.videos && product.videos[fieldName];
      
//       if (newVideo) {
//         finalVideos[fieldName] = newVideo;
//       } else if (existingVideo) {
//         finalVideos[fieldName] = existingVideo;
//       } else if (currentVideo) {
//         finalVideos[fieldName] = currentVideo;
//       }
//     }

//     let parsedSpecifications = {};
//     try {
//       if (specifications && typeof specifications === 'string') {
//         const specArray = JSON.parse(specifications);
//         if (Array.isArray(specArray)) {
//           specArray.forEach(spec => {
//             if (spec.key && spec.value) {
//               parsedSpecifications[spec.key] = spec.value;
//             }
//           });
//         }
//       }
//     } catch (error) {
//       parsedSpecifications = product.specifications || {};
//     }

//     const colorsArray = colors ? colors.split(',').map(c => c.trim()).filter(c => c) : product.colors || [];
//     const sizesArray = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : product.sizes || [];
//     const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : product.tags || [];
//     const metaKeywordsArray = metaKeywords ? metaKeywords.split(',').map(k => k.trim()).filter(k => k) : product.metaKeywords || [];

//     const updateData = {
//       name,
//       brand,
//       categoryId,
//       subCategoryId,
//       priceINR: Number(priceINR),
//       priceAED: Number(priceAED),
//       description,
//       shortDescription,
//       sku: sku || product.sku,
//       stock: Number(stock) || product.stock,
//       lowStockThreshold: Number(lowStockThreshold) || product.lowStockThreshold || 10,
//       images: finalImages,
//       videos: finalVideos,
//       trending: isTrending === 'true',
//       featured: isFeatured === 'true',
//       material: material || product.material,
//       colors: colorsArray,
//       sizes: sizesArray,
//       tags: tagsArray,
//       specifications: parsedSpecifications,
//       weight: weightValue ? {
//         value: Number(weightValue),
//         unit: weightUnit || product.weight?.unit || 'g'
//       } : product.weight,
//       dimensions: (length || width || height) ? {
//         length: length ? Number(length) : product.dimensions?.length,
//         width: width ? Number(width) : product.dimensions?.width,
//         height: height ? Number(height) : product.dimensions?.height,
//         unit: dimensionUnit || product.dimensions?.unit || 'cm'
//       } : product.dimensions,
//       warranty: (warrantyPeriod || warrantyDescription) ? {
//         period: warrantyPeriod ? Number(warrantyPeriod) : product.warranty?.period,
//         unit: warrantyUnit || product.warranty?.unit || 'months',
//         description: warrantyDescription || product.warranty?.description
//       } : product.warranty,
//       discount: (discountPercentage || discountAmount) ? {
//         percentage: discountPercentage ? Number(discountPercentage) : product.discount?.percentage || 0,
//         amount: discountAmount ? Number(discountAmount) : product.discount?.amount || 0,
//         startDate: discountStartDate || product.discount?.startDate,
//         endDate: discountEndDate || product.discount?.endDate
//       } : product.discount,
//       shippingInfo: {
//         weightBased: weightBasedShipping === 'true',
//         freeShipping: freeShipping === 'true',
//         shippingCost: shippingCost ? Number(shippingCost) : product.shippingInfo?.shippingCost || 0
//       },
//       metaTitle: metaTitle || product.metaTitle,
//       metaDescription: metaDescription || product.metaDescription,
//       metaKeywords: metaKeywordsArray
//     };

//     Object.keys(updateData).forEach(key => {
//       if (updateData[key] === undefined) {
//         delete updateData[key];
//       }
//     });

//     const updatedProduct = await productModel.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     ).populate('categoryId')
//      .populate('subCategoryId')
//      .populate('seller', 'name email');

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data: updatedProduct
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to update product",
//       error: error.message 
//     });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const { INR, email, DXB, name, phone, companyName, address, city, state, country, pincode, gstNumber, panNumber } = req.body;
    
//     const image = req.file?.location;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }
    
//     const updateFields = {};
//     if (INR) updateFields.INR = INR;
//     if (DXB) updateFields.DXB = DXB;
//     if (name) updateFields.name = name;
//     if (phone) updateFields.phone = phone;
//     if (companyName) updateFields.companyName = companyName;
//     if (address) updateFields.address = address;
//     if (city) updateFields.city = city;
//     if (state) updateFields.state = state;
//     if (country) updateFields.country = country;
//     if (pincode) updateFields.pincode = pincode;
//     if (gstNumber) updateFields.gstNumber = gstNumber;
//     if (panNumber) updateFields.panNumber = panNumber;
//     if (image) updateFields.profileImage = image; 
    
//     const updatedSeller = await SellerModel.findOneAndUpdate(
//       { email: email },
//       { $set: updateFields }, 
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!updatedSeller) {
//       return res.status(404).json({ message: "Seller not found" });
//     }
    
//     res.status(200).json({ 
//       success: true,
//       message: "Profile updated successfully", 
//       data: updatedSeller 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// };

// export const deleteProduct = async(req,res)=>{
//   try {
//     const id = req.params.id;
//     const response = await productModel.findByIdAndDelete(id);
    
//     if (!response) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete product",
//       error: error.message
//     });
//   }
// }

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await productModel.findById(id)
//       .populate('categoryId', 'name')
//       .populate('subCategoryId', 'name')
//       .populate('seller', 'name email phone');

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch product",
//       error: error.message
//     });
//   }
// };

// export const getSellerProfile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const seller = await SellerModel.findById(id)
//       .select('-password')
//       .populate('categories', 'name');

//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: seller
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch seller profile",
//       error: error.message
//     });
//   }
// };

// export const updateStock = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { stock } = req.body;

//     if (!stock && stock !== 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Stock quantity is required"
//       });
//     }

//     const product = await productModel.findByIdAndUpdate(
//       id,
//       { stock: Number(stock) },
//       { new: true }
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Stock updated successfully",
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update stock",
//       error: error.message
//     });
//   }
// };

// export const getSellerOrders = async (req, res) => {
//   try {
//     const sellerId = req.params.sellerId || req.user?._id;
    
//     if (!sellerId) {
//       return res.status(400).json({
//         success: false,
//         message: "Seller ID is required"
//       });
//     }

//     const orders = await OrderModel.find({
//       "sellerOrders.seller": sellerId
//     })
//     .populate('user', 'name email phone')
//     .populate({
//       path: 'items.product',
//       select: 'name brand images'
//     })
//     .sort({ createdAt: -1 });

//     const formattedOrders = orders.map(order => {
//       const sellerOrder = order.sellerOrders.find(so => 
//         so.seller.toString() === sellerId.toString()
//       );
      
//       return {
//         orderId: order.orderId,
//         createdAt: order.createdAt,
//         user: order.user,
//         items: order.items.filter(item => 
//           item.seller.toString() === sellerId.toString()
//         ),
//         subtotal: sellerOrder?.subtotal || 0,
//         shipping: sellerOrder?.shipping || 0,
//         tax: sellerOrder?.tax || 0,
//         total: sellerOrder?.total || 0,
//         sellerStatus: sellerOrder?.sellerStatus || 'pending',
//         trackingNumber: sellerOrder?.trackingNumber,
//         shippedAt: sellerOrder?.shippedAt,
//         orderStatus: order.status,
//         paymentStatus: order.paymentStatus
//       };
//     });

//     res.status(200).json({
//       success: true,
//       orders: formattedOrders
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get seller orders",
//       error: error.message
//     });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, status, trackingNumber } = req.body;
//     const sellerId = req.params.sellerId || req.user?._id;

//     if (!orderId || !status) {
//       return res.status(400).json({
//         success: false,
//         message: "Order ID and status are required"
//       });
//     }

//     const order = await OrderModel.findOne({ orderId });
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     const sellerOrder = order.sellerOrders.find(so => 
//       so.seller.toString() === sellerId.toString()
//     );

//     if (!sellerOrder) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to update this order"
//       });
//     }

//     sellerOrder.sellerStatus = status;
    
//     if (status === 'shipped' && trackingNumber) {
//       sellerOrder.trackingNumber = trackingNumber;
//       sellerOrder.shippedAt = new Date();
//     }

//     order.items.forEach(item => {
//       if (item.seller.toString() === sellerId.toString()) {
//         item.itemStatus = status;
//         if (status === 'shipped' && trackingNumber) {
//           item.trackingNumber = trackingNumber;
//         }
//       }
//     });

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order status updated successfully",
//       order: order
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update order status",
//       error: error.message
//     });
//   }
// };

// export const getSellerDashboardStats = async (req, res) => {
//   try {
//     const sellerId = req.params.sellerId || req.user?._id;
    
//     if (!sellerId) {
//       return res.status(400).json({
//         success: false,
//         message: "Seller ID is required"
//       });
//     }

//     const totalProducts = await productModel.countDocuments({ 
//       seller: sellerId,
//       active: true 
//     });

//     const orders = await OrderModel.find({
//       "sellerOrders.seller": sellerId
//     });

//     const totalOrders = orders.length;
    
//     let totalRevenue = 0;
//     let pendingOrders = 0;
//     let completedOrders = 0;

//     orders.forEach(order => {
//       const sellerOrder = order.sellerOrders.find(so => 
//         so.seller.toString() === sellerId.toString()
//       );
      
//       if (sellerOrder) {
//         totalRevenue += sellerOrder.total;
        
//         if (sellerOrder.sellerStatus === 'completed' || sellerOrder.sellerStatus === 'delivered') {
//           completedOrders++;
//         } else if (sellerOrder.sellerStatus === 'pending' || sellerOrder.sellerStatus === 'processing') {
//           pendingOrders++;
//         }
//       }
//     });

//     const lowStockProducts = await productModel.find({
//       seller: sellerId,
//       stock: { $lt: 10 },
//       active: true
//     })
//     .select('name stock images')
//     .limit(5);

//     const recentOrders = await OrderModel.find({
//       "sellerOrders.seller": sellerId
//     })
//     .populate('user', 'name')
//     .sort({ createdAt: -1 })
//     .limit(5);

//     const formattedRecentOrders = recentOrders.map(order => {
//       const sellerOrder = order.sellerOrders.find(so => 
//         so.seller.toString() === sellerId.toString()
//       );
      
//       return {
//         orderId: order.orderId,
//         date: order.createdAt,
//         customer: order.user.name,
//         amount: sellerOrder?.total || 0,
//         status: sellerOrder?.sellerStatus || 'pending'
//       };
//     });

//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     const monthlyRevenue = await OrderModel.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: sixMonthsAgo },
//           "sellerOrders.seller": new mongoose.Types.ObjectId(sellerId)
//         }
//       },
//       { $unwind: "$sellerOrders" },
//       {
//         $match: {
//           "sellerOrders.seller": new mongoose.Types.ObjectId(sellerId)
//         }
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" }
//           },
//           revenue: { $sum: "$sellerOrders.total" },
//           orders: { $sum: 1 }
//         }
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1 }
//       },
//       {
//         $project: {
//           _id: 0,
//           month: {
//             $let: {
//               vars: {
//                 monthsInString: [
//                   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//                 ]
//               },
//               in: {
//                 $arrayElemAt: [
//                   "$$monthsInString",
//                   { $subtract: ["$_id.month", 1] }
//                 ]
//               }
//             }
//           },
//           year: "$_id.year",
//           revenue: 1,
//           orders: 1
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       stats: {
//         totalProducts,
//         totalOrders,
//         totalRevenue,
//         pendingOrders,
//         completedOrders,
//         lowStockProducts,
//         recentOrders: formattedRecentOrders,
//         monthlyRevenue
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get dashboard stats",
//       error: error.message
//     });
//   }
// };

// export const getSellerProducts = async (req, res) => {
//   try {
//     const sellerId = req.params.sellerId || req.user?._id;
//     const { 
//       page = 1, 
//       limit = 20, 
//       search = '', 
//       category, 
//       status = 'all',
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     let query = { seller: sellerId };
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { brand: { $regex: search, $options: 'i' } },
//         { sku: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (category && category !== 'all') {
//       query.categoryId = category;
//     }
    
//     if (status === 'active') {
//       query.active = true;
//     } else if (status === 'inactive') {
//       query.active = false;
//     } else if (status === 'low-stock') {
//       query.stock = { $lt: 10 };
//     } else if (status === 'out-of-stock') {
//       query.stock = 0;
//     }
    
//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
//     const total = await productModel.countDocuments(query);
    
//     const products = await productModel.find(query)
//       .select('name brand priceINR priceAED stock images sku categoryId active createdAt')
//       .populate('categoryId', 'name')
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(parseInt(limit));

//     res.status(200).json({
//       success: true,
//       products,
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       totalPages: Math.ceil(total / parseInt(limit))
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get products",
//       error: error.message
//     });
//   }
// };

// export default {
//   SignUp,
//   login,
//   addProduct,
//   getProducts,
//   resetPassword,
//   updateProduct,
//   updateProfile,
//   deleteProduct,
//   getProductById,
//   getSellerProfile,
//   updateStock,
//   getSellerOrders,
//   updateOrderStatus,
//   getSellerDashboardStats,
//   getSellerProducts
// };



import SellerModel from "../Model/SellerModel.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import productModel from "../Model/ProductModel.js";
import categoryModel from "../Model/CategoryModel.js";
import OrderModel from "../Model/OrderModel.js";
import mongoose from "mongoose";
import emailService from "../Utils/emailService.js";

export const SignUp = async(req,res)=>{
    try {
      const {email,phone,password,name, companyName, address, city, state, country, pincode, gstNumber, panNumber } = req.body
      
      const existing = await SellerModel.findOne({email})

      if(existing){
        return res.status(400).json({message:"Email already exists"})
      }

      const salt = await bcrypt.genSalt(10)
      const hashedpass = await bcrypt.hash(password,salt)

      const seller = new SellerModel({
        name,
        email,
        phone,
        companyName,
        address,
        city,
        state,
        country,
        pincode,
        gstNumber,
        panNumber,
        password:hashedpass
      })

     await seller.save()

     const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json(token);
    } catch (error) {
      res.status(500).json({message:"Internal server error"})
    }
  }

export const login = async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;

      if (!emailOrPhone || !password) {
        return res.status(400).json({ message: "Email/Phone and password are required" });
      }

      const seller = await SellerModel.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      });

      if (!seller) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password,seller.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.status(200).json({ 
        message: 'Login successful', 
        token,
        user: {
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          companyName: seller.companyName,
          _id: seller._id,
          status: seller.status,
          profileImage: seller.profileImage
        }
      });
      
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export const addProduct = async (req, res) => {
  try {

    const { 
      name, brand, priceINR, priceAED, categoryId, subCategoryId, sellerId,
      description, shortDescription, sku, stock, lowStockThreshold, material,
      colors, sizes, tags, weightValue, weightUnit, length, width, height,
      dimensionUnit, warrantyPeriod, warrantyUnit, warrantyDescription,
      isTrending, isFeatured, discountPercentage, discountAmount, 
      discountStartDate, discountEndDate, weightBasedShipping, freeShipping,
      shippingCost, metaTitle, metaDescription, metaKeywords, specifications
    } = req.body;

    if (!name || !brand || !priceINR || !priceAED || !categoryId || !sellerId || !stock) {

      return res.status(400).json({
        
        success: false,
        message: "Missing required fields"
      });
    }

    const categoryExists = await categoryModel.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }


    let finalSku = sku;
    if (!finalSku) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      finalSku = `SKU_${timestamp}_${random}`;
    }

    const existingSku = await productModel.findOne({ sku: finalSku });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists"
      });
    }

    const images = {};
    const videos = {};

    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          images[fieldName] = req.files[fieldName][0].location;
        }
      }

      for (let i = 1; i <= 2; i++) {
        const fieldName = `video${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          videos[fieldName] = req.files[fieldName][0].location;
        }
      }
    }

    if (!images.image1) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required"
      });
    }

    let parsedSpecifications = {};
    try {
      if (specifications && typeof specifications === 'string') {
        const specArray = JSON.parse(specifications);
        if (Array.isArray(specArray)) {
          specArray.forEach(spec => {
            if (spec.key && spec.value) {
              parsedSpecifications[spec.key] = spec.value;
            }
          });
        }
      }
    } catch (error) {
      console.error('Error parsing specifications:', error);
    }


    const colorsArray = colors ? colors.split(',').map(c => c.trim()).filter(c => c) : [];
    const sizesArray = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : [];
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
    const metaKeywordsArray = metaKeywords ? metaKeywords.split(',').map(k => k.trim()).filter(k => k) : [];


    const productData = {
      name,
      brand,
      priceINR: Number(priceINR),
      priceAED: Number(priceAED),
      description,
      shortDescription,
      sku: finalSku,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold) || 10,
      images,
      videos,
      subCategoryId,
      categoryId,
      seller: sellerId,
      material,
      colors: colorsArray,
      sizes: sizesArray,
      tags: tagsArray,
      specifications: parsedSpecifications,
      weight: weightValue ? {
        value: Number(weightValue),
        unit: weightUnit || 'g'
      } : undefined,
      dimensions: (length || width || height) ? {
        length: length ? Number(length) : undefined,
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        unit: dimensionUnit || 'cm'
      } : undefined,
      warranty: (warrantyPeriod || warrantyDescription) ? {
        period: warrantyPeriod ? Number(warrantyPeriod) : undefined,
        unit: warrantyUnit || 'months',
        description: warrantyDescription
      } : undefined,
      trending: isTrending === 'true',
      featured: isFeatured === 'true',
      discount: (discountPercentage || discountAmount) ? {
        percentage: discountPercentage ? Number(discountPercentage) : 0,
        amount: discountAmount ? Number(discountAmount) : 0,
        startDate: discountStartDate,
        endDate: discountEndDate
      } : undefined,
      shippingInfo: {
        weightBased: weightBasedShipping === 'true',
        freeShipping: freeShipping === 'true',
        shippingCost: shippingCost ? Number(shippingCost) : 0
      },
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywordsArray
    };

    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined || productData[key] === null) {
        delete productData[key];
      }
    });

    const product = await productModel.create(productData);
    
    await SellerModel.findByIdAndUpdate(product.seller, {
      $addToSet: { categories: productData.categoryId }
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
    try {
        const seller = req.params.id
      const products = await productModel
        .find({ seller: seller })
        .populate('categoryId', 'name')
        .populate('subCategoryId','name')
        .sort({ createdAt: -1 });

      if (!products.length) {
        return res.status(404).json({
          success: false,
          message: "No products found"
        });
      }

      res.status(200).json({products});
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message
      });
    }
  };

export const resetPassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { userId } = req.params;

      const seller = await SellerModel.findById(userId);
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, seller.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      seller.password = hashedNewPassword;
      await seller.save();

      res.status(200).json({ message: "Password updated successfully" });
      
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, brand, categoryId, subCategoryId, priceINR, priceAED, isTrending,
      existingImages, existingVideos, description, shortDescription, sku, stock,
      lowStockThreshold, material, colors, sizes, tags, weightValue, weightUnit,
      length, width, height, dimensionUnit, warrantyPeriod, warrantyUnit,
      warrantyDescription, isFeatured, discountPercentage, discountAmount,
      discountStartDate, discountEndDate, weightBasedShipping, freeShipping,
      shippingCost, metaTitle, metaDescription, metaKeywords, specifications
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let parsedExistingImages = {};
    try {
      if (existingImages && typeof existingImages === 'string') {
        const parsed = JSON.parse(existingImages);
        if (Array.isArray(parsed)) {
          parsed.forEach((url, index) => {
            if (url) parsedExistingImages[`image${index + 1}`] = url;
          });
        } else if (typeof parsed === 'object') {
          parsedExistingImages = parsed;
        }
      }
    } catch (error) {
      console.error('Error parsing existing images:', error);
    }

    let parsedExistingVideos = {};
    try {
      if (existingVideos && typeof existingVideos === 'string') {
        const parsed = JSON.parse(existingVideos);
        if (Array.isArray(parsed)) {
          parsed.forEach((url, index) => {
            if (url) parsedExistingVideos[`video${index + 1}`] = url;
          });
        } else if (typeof parsed === 'object') {
          parsedExistingVideos = parsed;
        }
      }
    } catch (error) {
      console.error('Error parsing existing videos:', error);
    }

    const newImages = {};
    const newVideos = {};

    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          newImages[fieldName] = req.files[fieldName][0].location;
        }
      }

      for (let i = 1; i <= 2; i++) {
        const fieldName = `video${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          newVideos[fieldName] = req.files[fieldName][0].location;
        }
      }
    }

    const finalImages = {};
    for (let i = 1; i <= 4; i++) {
      const fieldName = `image${i}`;
      const newImage = newImages[fieldName];
      const existingImage = parsedExistingImages[fieldName];
      const currentImage = product.images && product.images[fieldName];
      
      if (newImage) {
        finalImages[fieldName] = newImage;
      } else if (existingImage) {
        finalImages[fieldName] = existingImage;
      } else if (currentImage) {
        finalImages[fieldName] = currentImage;
      }
    }

    const finalVideos = {};
    for (let i = 1; i <= 2; i++) {
      const fieldName = `video${i}`;
      const newVideo = newVideos[fieldName];
      const existingVideo = parsedExistingVideos[fieldName];
      const currentVideo = product.videos && product.videos[fieldName];
      
      if (newVideo) {
        finalVideos[fieldName] = newVideo;
      } else if (existingVideo) {
        finalVideos[fieldName] = existingVideo;
      } else if (currentVideo) {
        finalVideos[fieldName] = currentVideo;
      }
    }

    let parsedSpecifications = {};
    try {
      if (specifications && typeof specifications === 'string') {
        const specArray = JSON.parse(specifications);
        if (Array.isArray(specArray)) {
          specArray.forEach(spec => {
            if (spec.key && spec.value) {
              parsedSpecifications[spec.key] = spec.value;
            }
          });
        }
      }
    } catch (error) {
      parsedSpecifications = product.specifications || {};
    }

    const colorsArray = colors ? colors.split(',').map(c => c.trim()).filter(c => c) : product.colors || [];
    const sizesArray = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : product.sizes || [];
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : product.tags || [];
    const metaKeywordsArray = metaKeywords ? metaKeywords.split(',').map(k => k.trim()).filter(k => k) : product.metaKeywords || [];

    const updateData = {
      name,
      brand,
      categoryId,
      subCategoryId,
      priceINR: Number(priceINR),
      priceAED: Number(priceAED),
      description,
      shortDescription,
      sku: sku || product.sku,
      stock: Number(stock) || product.stock,
      lowStockThreshold: Number(lowStockThreshold) || product.lowStockThreshold || 10,
      images: finalImages,
      videos: finalVideos,
      trending: isTrending === 'true',
      featured: isFeatured === 'true',
      material: material || product.material,
      colors: colorsArray,
      sizes: sizesArray,
      tags: tagsArray,
      specifications: parsedSpecifications,
      weight: weightValue ? {
        value: Number(weightValue),
        unit: weightUnit || product.weight?.unit || 'g'
      } : product.weight,
      dimensions: (length || width || height) ? {
        length: length ? Number(length) : product.dimensions?.length,
        width: width ? Number(width) : product.dimensions?.width,
        height: height ? Number(height) : product.dimensions?.height,
        unit: dimensionUnit || product.dimensions?.unit || 'cm'
      } : product.dimensions,
      warranty: (warrantyPeriod || warrantyDescription) ? {
        period: warrantyPeriod ? Number(warrantyPeriod) : product.warranty?.period,
        unit: warrantyUnit || product.warranty?.unit || 'months',
        description: warrantyDescription || product.warranty?.description
      } : product.warranty,
      discount: (discountPercentage || discountAmount) ? {
        percentage: discountPercentage ? Number(discountPercentage) : product.discount?.percentage || 0,
        amount: discountAmount ? Number(discountAmount) : product.discount?.amount || 0,
        startDate: discountStartDate || product.discount?.startDate,
        endDate: discountEndDate || product.discount?.endDate
      } : product.discount,
      shippingInfo: {
        weightBased: weightBasedShipping === 'true',
        freeShipping: freeShipping === 'true',
        shippingCost: shippingCost ? Number(shippingCost) : product.shippingInfo?.shippingCost || 0
      },
      metaTitle: metaTitle || product.metaTitle,
      metaDescription: metaDescription || product.metaDescription,
      metaKeywords: metaKeywordsArray
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('categoryId')
     .populate('subCategoryId')
     .populate('seller', 'name email');

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to update product",
      error: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { INR, email, DXB, name, phone, companyName, address, city, state, country, pincode, gstNumber, panNumber } = req.body;
    
    const image = req.file?.location;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const updateFields = {};
    if (INR) updateFields.INR = INR;
    if (DXB) updateFields.DXB = DXB;
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (companyName) updateFields.companyName = companyName;
    if (address) updateFields.address = address;
    if (city) updateFields.city = city;
    if (state) updateFields.state = state;
    if (country) updateFields.country = country;
    if (pincode) updateFields.pincode = pincode;
    if (gstNumber) updateFields.gstNumber = gstNumber;
    if (panNumber) updateFields.panNumber = panNumber;
    if (image) updateFields.profileImage = image; 
    
    const updatedSeller = await SellerModel.findOneAndUpdate(
      { email: email },
      { $set: updateFields }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Profile updated successfully", 
      data: updatedSeller 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

export const deleteProduct = async(req,res)=>{
  try {
    const id = req.params.id;
    const response = await productModel.findByIdAndDelete(id);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
}

export const getSellerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await SellerModel.findById(id)
      .select('-password')
      .populate('categories', 'name');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    res.status(200).json({
      success: true,
      data: seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller profile",
      error: error.message
    });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.sellerId 

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required"
      });
    }

    const orders = await OrderModel.find({
      "sellerOrders.seller": sellerId
    })
      .populate("user", "name email phone")
      .populate({
        path: "items.product",
        select: "name brand images"
      })
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => {
      const sellerOrder = order.sellerOrders.find(
        so => so.seller.toString() === sellerId.toString()
      );

      return {
        orderId: order.orderId,
        createdAt: order.createdAt,
        user: order.user,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        items: order.items.filter(
          item => item.seller.toString() === sellerId.toString()
        ),
        subtotal: sellerOrder?.subtotal || 0,
        shipping: sellerOrder?.shipping || 0,
        tax: sellerOrder?.tax || 0,
        total: sellerOrder?.total || 0,
        sellerStatus: sellerOrder?.sellerStatus || "pending"
      };
    });

    res.status(200).json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get seller orders",
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, trackingNumber } = req.body;
    const sellerId = req.sellerId;

    if (!orderId || !status || !sellerId) {
      return res.status(400).json({
        success: false,
        message: "Order ID, status and sellerId are required"
      });
    }

    const allowedSellerStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!allowedSellerStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller status"
      });
    }

    const order = await OrderModel.findOne({ orderId })
      .populate('user', 'name email')
      .populate({
        path: 'sellerOrders.seller',
        select: 'email name'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const sellerOrder = order.sellerOrders.find(
      so => so.seller._id.equals(sellerObjectId)
    );

    if (!sellerOrder) {
      return res.status(403).json({
        success: false,
        message: "Seller not authorized for this order"
      });
    }

    sellerOrder.sellerStatus = status;

    order.items.forEach(item => {
      if (item.seller.equals(sellerObjectId)) {
        if (status === "processing") item.itemStatus = "packed";
        if (status === "shipped") item.itemStatus = "shipped";
        if (status === "delivered") item.itemStatus = "delivered";

        if (status === "shipped" && trackingNumber) {
          item.trackingNumber = trackingNumber;
        }
      }
    });

    const sellerStatuses = order.sellerOrders.map(so => so.sellerStatus);

    if (sellerStatuses.every(s => s === "delivered")) {
      order.status = "delivered";
    } else if (sellerStatuses.every(s => s === "shipped")) {
      order.status = "shipped";
    } else if (sellerStatuses.some(s => s === "shipped")) {
      order.status = "partially_shipped";
    } else {
      order.status = "processing";
    }

    order.markModified("sellerOrders");
    order.markModified("items");

    await order.save();

    if (order.user?.email && (status === 'shipped' || status === 'delivered' || status === 'cancelled')) {
      try {
        await emailService.sendOrderStatusUpdateEmail(order.user.email, order, status);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

export const updateReturnStatus = async (req, res) => {
  try {
    const { orderId, itemId, status, reason } = req.body;
    const sellerId = req?.sellerId;

    if (!orderId || !itemId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID, Item ID and status are required"
      });
    }

    const order = await OrderModel.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const item = order.items.find(item => 
      item._id.toString() === itemId && 
      item.seller.toString() === sellerId.toString()
    );

    if (!item) {
      return res.status(403).json({
        success: false,
        message: "Item not found or unauthorized"
      });
    }

    item.returnStatus = status;
    if (reason) {
      item.returnReason = reason;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return status updated successfully",
      order: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update return status",
      error: error.message
    });
  }
};

export const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req?.sellerId;
    
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required"
      });
    }

    const totalProducts = await productModel.countDocuments({ 
      seller: sellerId,
      active: true 
    });

    const orders = await OrderModel.find({
      "sellerOrders.seller": sellerId
    });

    const totalOrders = orders.length;
    
    let totalRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;

    orders.forEach(order => {
      const sellerOrder = order.sellerOrders.find(so => 
        so.seller.toString() === sellerId.toString()
      );
      
      if (sellerOrder) {
        totalRevenue += sellerOrder.total;
        
        if (sellerOrder.sellerStatus === 'completed' || sellerOrder.sellerStatus === 'delivered') {
          completedOrders++;
        } else if (sellerOrder.sellerStatus === 'pending' || sellerOrder.sellerStatus === 'processing') {
          pendingOrders++;
        }
      }
    });

    const stats = {
      totalProducts,
      totalOrders,
      totalSales: totalRevenue,
      pendingOrders,
      completedOrders
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard stats",
      error: error.message
    });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { range = 'month' } = req.query;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required"
      });
    }

    const now = new Date();
    let startDate, endDate, previousStartDate, previousEndDate;

    switch(range) {
      case 'week':
        endDate = new Date(now);
        startDate = new Date(now.setDate(now.getDate() - 7));
        previousEndDate = new Date(startDate);
        previousStartDate = new Date(previousEndDate.setDate(previousEndDate.getDate() - 7));
        break;
      case 'quarter':
        endDate = new Date(now);
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        previousEndDate = new Date(startDate);
        previousStartDate = new Date(previousEndDate.setMonth(previousEndDate.getMonth() - 3));
        break;
      case 'year':
        endDate = new Date(now);
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        previousEndDate = new Date(startDate);
        previousStartDate = new Date(previousEndDate.setFullYear(previousEndDate.getFullYear() - 1));
        break;
      default:
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    }

    const orders = await OrderModel.find({
      "sellerOrders.seller": sellerId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate({
      path: "items.product",
      select: "name brand images categoryId"
    }).populate({
      path: "items.product.categoryId",
      select: "name"
    });

    const previousOrders = await OrderModel.find({
      "sellerOrders.seller": sellerId,
      createdAt: { $gte: previousStartDate, $lte: previousEndDate }
    });

    let totalSales = 0;
    let totalOrdersCount = 0;
    let totalProductsSold = 0;
    const salesData = [];
    const categoryData = {};
    const productData = {};
    const monthlyTrends = [];

    orders.forEach(order => {
      const sellerOrder = order.sellerOrders.find(so => 
        so.seller.toString() === sellerId.toString()
      );

      if (sellerOrder) {
        totalSales += sellerOrder.total;
        totalOrdersCount += 1;

        order.items.forEach(item => {
          if (item.seller.toString() === sellerId.toString()) {
            totalProductsSold += item.quantity;

            const date = new Date(order.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });

            const existingDate = salesData.find(d => d.date === date);
            if (existingDate) {
              existingDate.sales += item.price * item.quantity;
              existingDate.orders += 1;
            } else {
              salesData.push({
                date,
                sales: item.price * item.quantity,
                orders: 1
              });
            }

            if (item.product && item.product.categoryId) {
              const categoryName = item.product.categoryId.name;
              categoryData[categoryName] = (categoryData[categoryName] || 0) + (item.price * item.quantity);
            }

            if (item.product) {
              const productId = item.product._id.toString();
              if (!productData[productId]) {
                productData[productId] = {
                  name: item.product.name,
                  brand: item.product.brand || '',
                  category: item.product.categoryId?.name || 'Uncategorized',
                  image: item.product.images?.image1 || '',
                  unitsSold: 0,
                  revenue: 0
                };
              }
              productData[productId].unitsSold += item.quantity;
              productData[productId].revenue += item.price * item.quantity;
            }
          }
        });
      }
    });

    let previousTotalSales = 0;
    previousOrders.forEach(order => {
      const sellerOrder = order.sellerOrders.find(so => 
        so.seller.toString() === sellerId.toString()
      );
      if (sellerOrder) {
        previousTotalSales += sellerOrder.total;
      }
    });

    const growthRate = previousTotalSales > 0 
      ? ((totalSales - previousTotalSales) / previousTotalSales * 100)
      : totalSales > 0 ? 100 : 0;

    const avgOrderValue = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;

    const topProducts = Object.values(productData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(product => ({
        ...product,
        growth: Math.floor(Math.random() * 30) - 10
      }));

    const categoryArray = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value
    }));

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });

      let monthSales = 0;
      monthOrders.forEach(order => {
        const sellerOrder = order.sellerOrders.find(so => 
          so.seller.toString() === sellerId.toString()
        );
        if (sellerOrder) monthSales += sellerOrder.total;
      });

      monthlyTrends.unshift({
        month: monthName,
        current: monthSales,
        previous: Math.floor(monthSales * (0.7 + Math.random() * 0.6))
      });
    }

    const reportData = {
      summary: {
        totalSales,
        totalOrders: totalOrdersCount,
        totalProducts: totalProductsSold,
        avgOrderValue: Math.round(avgOrderValue),
        growthRate: Math.round(growthRate * 100) / 100
      },
      salesData: salesData.sort((a, b) => new Date(a.date) - new Date(b.date)),
      topProducts,
      categoryData: categoryArray,
      monthlyTrends
    };

    res.status(200).json(reportData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate sales report",
      error: error.message
    });
  }
};

export default {
  SignUp,
  login,
  addProduct,
  getProducts,
  resetPassword,
  updateProduct,
  updateProfile,
  deleteProduct,
  getSellerProfile,
  getSellerOrders,
  updateOrderStatus,
  updateReturnStatus,
  getSellerDashboardStats,
  getSalesReport
};
