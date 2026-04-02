import productModel from "../Model/ProductModel.js";
import categoryModel from "../Model/CategoryModel.js";
import subcategoryModel from "../Model/SubCategoryModel.js";
import AdminModel from "../Model/AdminModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import SellerModel from "../Model/SellerModel.js";

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file?.location;
    
    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }
    
    const newCategory = new categoryModel({
      name,
      image
    });
    
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addSubcategory = async(req,res)=>{
  try {
    const { name,categoryId } = req.body;
    const image = req.file?.location;
    
    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }
    
    const newCategory = new subcategoryModel({
      name,
      categoryId,
      image
    });
    
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getSubCategory = async (req, res) => {
  try {
    const subcategories = await subcategoryModel.find().populate('categoryId');
    if (!subcategories.length) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTrending = async (req, res) => {
  try {
    const id = req.params.id;
    
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { trending: !product.trending },
      { new: true } 
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const SignUp = async(req,res)=>{
  try {
    const {email,phone,password} = req.body
    const existing = await AdminModel.findOne({email})

    if(existing){
      res.status(400).json({message:"email already existed"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedpass = await bcrypt.hash(password,salt)

    const admin = new AdminModel({
      email,
      phone,
      password:hashedpass
    })

   await admin.save()

   const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(201).json({ message: 'User registered successfully', token });
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

    const admin = await AdminModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password,admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        email: admin.email,
        phone: admin.phone,
        _id: admin._id
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editCategory = async(req,res)=>{
  try {
    const image = req.file?.location;
   const {name,categoryId} = req.body

   const response = await categoryModel.updateOne(
    {_id:categoryId},
    {name:name,image:image}
   )

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const editSubcategory = async(req,res)=>{
  try {
    const image = req.file?.location
    const {name,categoryId} = req.body
    const id = req.params.id
    const response = await subcategoryModel.updateOne(
      {_id:id},
      {name:name,image:image}
    )

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json("Internal server error")
  }
}

export const getSellers = async(req,res)=>{
  try {
    const sellers = await SellerModel.find()
    if(sellers){
      res.status(200).json(sellers)
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateStatus = async(req,res)=>{
  try {
    const id = req.params.id

    const seller = await SellerModel.findById(id)
    const status = seller.status
    const update = await SellerModel.findByIdAndUpdate(
      {_id:id},
      {status:!status}
    )

    res.json({
      success: true,
      seller: update
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getSellerProduct = async(req,res)=>{
  try {
    const id = req.params.id
    const products = await productModel
    .find({ seller: id }).populate('categoryId', 'name').populate('subCategoryId','name').populate("seller","name")
    .sort({ createdAt: -1 });
    
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const sellerByid = async(req,res)=>{
  try {
    const id = req.params.id
    const seller = await SellerModel.findById(id)

    res.status(200).json(seller)  
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getProducts = async(req,res)=>{
  try {
    const products = await productModel.find().populate('categoryId', 'name').populate('subCategoryId','name').populate("seller","name")
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}