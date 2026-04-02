import categoryModel from "../Model/CategoryModel.js"
import productModel from "../Model/ProductModel.js"
import SellerModel from "../Model/SellerModel.js";
import subcategoryModel from "../Model/SubCategoryModel.js";
import mongoose from "mongoose";

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setToCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const clearCache = (keyPattern) => {
  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
};

export const getProduct = async(req,res)=>{
    try {
        const { 
          page = 1, 
          limit = 20, 
          search = '', 
          category, 
          subcategory, 
          seller,
          trending = false 
        } = req.query;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const cacheKey = `products:${page}:${limit}:${search}:${category}:${subcategory}:${seller}:${trending}`;
        
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          return res.status(200).json(cachedData);
        }
        
        let query = { active: true };
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.categoryId = new mongoose.Types.ObjectId(category);
        }
        
        if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
            query.subCategoryId = new mongoose.Types.ObjectId(subcategory);
        }
        
        if (seller && mongoose.Types.ObjectId.isValid(seller)) {
            query.seller = new mongoose.Types.ObjectId(seller);
        }
        
        if (trending === 'true') {
            query.trending = true;
        }
        
        const total = await productModel.countDocuments(query);
        
        const products = await productModel.find(query)
            .select('name brand priceINR priceAED description images categoryId seller trending createdAt')
            .populate('categoryId', 'name')
            .populate('seller', 'name image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
        
        if(!products || products.length === 0){
            return res.status(404).json({ 
                success: false,
                message: "No products found",
                products: [],
                total: 0,
                page: parseInt(page),
                totalPages: 0
            });
        }
        
        const response = {
            success: true,
            products,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getCategory = async(req,res)=>{
    try {
        const {id} = req.params;
        const cacheKey = `categories:${id}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid seller ID format" 
            });
        }

        const seller = await SellerModel.findById(id).select('categories').lean();

        if (!seller) {
            return res.status(404).json({ 
                success: false,
                message: "Seller not found" 
            });
        }

        if (!seller.categories || seller.categories.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No categories assigned to this seller",
                categories: []
            });
        }

        const categories = await categoryModel.find({
            _id: { $in: seller.categories },
        }).select('name image description').lean();

        const response = {
            success: true,
            categories: categories || []
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get category error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getSubCategories = async(req,res)=>{
    try {

      console.log("first")
        const { id } = req.params;
        console.log(id)
        const cacheKey = `subcategories:${id}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid category ID format" 
            });
        }

        const subcategories = await subcategoryModel.find({
            categoryId: id,
            active: true
        }).select('name image description').sort({ name: 1 }).lean();

        const response = {
            success: true,
            subcategories: subcategories || []
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get subcategories error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getDetails = async(req,res)=>{
    try {
        const {id} = req.params;
        
        const cacheKey = `product:${id}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid product ID format" 
            });
        }

        const product = await productModel.findById(id)
            .select('-__v')
            .populate('subCategoryId', 'name image')
            .populate('categoryId', 'name')
            .populate('seller', 'name image address INR DXB email')
            .lean();

            console.log(product.seller)
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found" 
            });
        }

        const response = {
            success: true,
            product
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get details error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getSubCategory = async (req, res) => {
    try {

      console.log("jjeje")
        const sellerId = req.params.id;
        const categoryId = req.params.category;
        
        const cacheKey = `seller-category:${sellerId}:${categoryId}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        if (!mongoose.Types.ObjectId.isValid(sellerId) || 
            !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid seller or category ID format" 
            });
        }

        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

        const subcategories = await productModel.aggregate([
            {
                $match: {
                    seller: sellerObjectId,
                    categoryId: categoryObjectId,
                }
            },
            {
                $group: {
                    _id: "$subCategoryId",
                    productCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "subcategoryInfo"
                }
            },
            {
                $unwind: "$subcategoryInfo"
            },
            {
                $project: {
                    _id: "$subcategoryInfo._id",
                    name: "$subcategoryInfo.name",
                    image: "$subcategoryInfo.image",
                    description: "$subcategoryInfo.description",
                    itemCount: "$productCount"
                }
            },
            {
                $sort: { name: 1 }
            }
        ]);

        console.log(subcategories)
        const response = {
            success: true,
            subcategories: subcategories || []
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get subcategory error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error"
        });
    }
}

export const ProductType = async(req,res)=>{
    try {
        const {id} = req.params;
        
        const cacheKey = `types:${id}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid subcategory ID format" 
            });
        }

        const types = await productModel.aggregate([
            {
                $match: {
                    subCategoryId: new mongoose.Types.ObjectId(id),
                    active: true,
                    type: { $exists: true, $ne: "" }
                }
            },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: 1
                }
            },
            {
                $sort: { type: 1 }
            }
        ]);

        const response = {
            success: true,
            types: types || []
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Product type error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const relatedProduct = async (req, res) => {
    try {
        const subCategoryId = req.params.category;
        const sellerId = req.params.seller;
        
        const cacheKey = `related:${subCategoryId}:${sellerId}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        if (!mongoose.Types.ObjectId.isValid(subCategoryId) || 
            !mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid subcategory or seller ID format" 
            });
        }

        const subCategoryObjectId = new mongoose.Types.ObjectId(subCategoryId);
        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        
        const products = await productModel.find({ 
            subCategoryId: subCategoryObjectId,
            seller: sellerObjectId,
            active: true 
        })
        .select('name brand priceINR priceAED images')
        .populate("seller", "name image")
        .limit(10)
        .sort({ createdAt: -1 })
        .lean();
        
        const response = {
            success: true,
            products: products || []
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Related products error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error"
        });
    }
};

export const getSellers = async(req,res)=>{
    try {
        const cacheKey = 'sellers';
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const sellers = await SellerModel.find({ status: true })
            .select('name Image description address contact email categories createdAt')
            .sort({ name: 1 })
            .lean();

        const response = {
            success: true,
            sellers: sellers || []
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get sellers error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getProductsByType = async(req,res)=>{
    try {
        const { type, subCategoryId, sellerId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const cacheKey = `products-type:${type}:${subCategoryId}:${sellerId}:${page}:${limit}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }
        
        let query = { 
            active: true,
            type: type 
        };
        
        if (mongoose.Types.ObjectId.isValid(subCategoryId)) {
            query.subCategoryId = new mongoose.Types.ObjectId(subCategoryId);
        }
        
        if (mongoose.Types.ObjectId.isValid(sellerId)) {
            query.seller = new mongoose.Types.ObjectId(sellerId);
        }
        
        const total = await productModel.countDocuments(query);
        const products = await productModel.find(query)
            .select('name brand priceINR priceAED images')
            .populate('seller', 'name image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
        
        const response = {
            success: true,
            products: products || [],
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get products by type error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getProductsBySeller = async(req,res)=>{
    try {
        const { sellerId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const cacheKey = `products-seller:${sellerId}:${page}:${limit}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }
        
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid seller ID format" 
            });
        }
        
        const query = { 
            seller: new mongoose.Types.ObjectId(sellerId),
            active: true 
        };
        
        const total = await productModel.countDocuments(query);
        const products = await productModel.find(query)
            .select('name brand priceINR priceAED images categoryId')
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
        
        const response = {
            success: true,
            products: products || [],
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
        };
        
        setToCache(cacheKey, response);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Get products by seller error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const clearCacheHandler = async (req, res) => {
    try {
        const { key } = req.query;
        if (key === process.env.CACHE_CLEAR_KEY) {
            clearCache('');
            res.status(200).json({ success: true, message: 'Cache cleared' });
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export default {
    getProduct,
    getCategory,
    getSubCategories,
    getDetails,
    getSubCategory,
    ProductType,
    relatedProduct,
    getSellers,
    getProductsByType,
    getProductsBySeller,
    clearCacheHandler
};