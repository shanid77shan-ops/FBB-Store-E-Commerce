import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  priceINR: {
    type: Number,
    required: true,
    min: 0
  },
  priceAED: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  shortDescription: {
    type: String,
    maxlength: 200,
    trim: true
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },
  weight: {
    value: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['g', 'kg', 'lb', 'oz'],
      default: 'g'
    }
  },
  dimensions: {
    length: {
      type: Number,
      min: 0
    },
    width: {
      type: Number,
      min: 0
    },
    height: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['cm', 'inch', 'mm'],
      default: 'cm'
    }
  },
  colors: [{
    type: String,
    trim: true
  }],
  sizes: [{
    type: String,
    trim: true
  }],
  material: {
    type: String,
    trim: true
  },
  warranty: {
    period: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['days', 'months', 'years']
    },
    description: {
      type: String,
      trim: true
    }
  },
  tags: [{
    type: String,
    trim: true,
    index: true
  }],
  images: {
    image1: { type: String, required: true },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String }
  },
  videos: {
    video1: { type: String },
    video2: { type: String }
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategory',
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  trending: {
    type: Boolean,
    default: false,
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    startDate: Date,
    endDate: Date
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    index: true,
    trim: true
  },
  shippingInfo: {
    weightBased: {
      type: Boolean,
      default: false
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    processingTime: {
      type: Number,
      default: 1,
      min: 0
    },
    processingUnit: {
      type: String,
      enum: ['hours', 'days'],
      default: 'days'
    }
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  metaKeywords: [{
    type: String,
    trim: true
  }]
}, { 
  timestamps: true 
});

ProductSchema.index({ seller: 1, trending: 1 });
ProductSchema.index({ categoryId: 1, active: 1 });
ProductSchema.index({ subCategoryId: 1, active: 1 });
ProductSchema.index({ trending: 1, active: 1, createdAt: -1 });
ProductSchema.index({ stock: 1, active: 1 });
ProductSchema.index({ 'discount.percentage': 1, active: 1 });
ProductSchema.index({ name: 'text', brand: 'text', description: 'text', shortDescription: 'text' });

const productModel = mongoose.model('Product', ProductSchema);

export default productModel;