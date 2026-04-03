import UserModel from "../Model/UserModel.js";
import ProductModel from "../Model/ProductModel.js";
import OrderModel from "../Model/OrderModel.js";
import mongoose from "mongoose";
import crypto from "crypto";

const getUser = async (req) => {
  if (req.user && req.user._id) {
    return await UserModel.findById(req.user._id);
  }
  
  const { deviceId, sessionToken } = req.cookies || {};
  
  if (deviceId || sessionToken) {
    let user = await UserModel.findOne({
      $or: [
        { deviceId, isGuest: true },
        { sessionToken }
      ]
    });

    if (!user) {
      user = new UserModel({
        deviceId,
        sessionToken,
        isGuest: true,
        preferences: {
          region: 'IN',
          currency: 'INR',
          notifications: {
            email: false,
            whatsapp: false,
            sms: false
          }
        }
      });
      await user.save();
    }

    return user;
  }

  throw new Error("User not found");
};

// Helper function to calculate cart totals
const calculateCartTotals = (cart) => {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { cartCount, cartTotal };
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, color, size } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await ProductModel.findById(productId).populate('seller');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
        availableStock: product.stock
      });
    }

    const user = await getUser(req);

    const existingItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId &&
      item.selectedColor === color &&
      item.selectedSize === size
    );

    if (existingItemIndex > -1) {
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: "Cannot add more items. Stock limit reached",
          availableStock: product.stock
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
        selectedColor: color,
        selectedSize: size,
        price: product.priceINR,
        seller: product.seller._id
      });
    }

    await user.save();

    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock colors sizes seller',
      populate: {
        path: 'seller',
        select: 'name companyName'
      }
    });

    const { cartCount, cartTotal } = calculateCartTotals(user.cart);

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: user.cart,
      cartCount,
      cartTotal
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
      error: error.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || !quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid cart item ID and quantity are required"
      });
    }

    const user = await getUser(req);
    
    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    const product = await ProductModel.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (quantity === 0) {
      cartItem.remove();
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock available",
          availableStock: product.stock
        });
      }
      cartItem.quantity = quantity;
    }

    await user.save();
    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock colors sizes seller',
      populate: {
        path: 'seller',
        select: 'name companyName'
      }
    });

    const { cartCount, cartTotal } = calculateCartTotals(user.cart);

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
      cartCount,
      cartTotal
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    cartItem.remove();
    await user.save();

    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock colors sizes seller',
      populate: {
        path: 'seller',
        select: 'name companyName'
      }
    });

    const { cartCount, cartTotal } = calculateCartTotals(user.cart);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart,
      cartCount,
      cartTotal
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from cart",
      error: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await getUser(req);
    user.cart = [];
    await user.save();
    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: [],
      cartCount: 0,
      cartTotal: 0
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await getUser(req);

    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock colors sizes active seller shippingInfo',
      populate: {
        path: 'seller',
        select: 'name companyName phone email address city state country pincode'
      }
    });

    const activeCartItems = user.cart.filter(item => item.product && item.product.active);

    if (activeCartItems.length !== user.cart.length) {
      user.cart = activeCartItems;
      await user.save();
    }

    const cartBySeller = {};
    user.cart.forEach(item => {
      const sellerId = item.product.seller._id.toString();
      if (!cartBySeller[sellerId]) {
        cartBySeller[sellerId] = {
          seller: item.product.seller,
          items: [],
          subtotal: 0,
          shipping: item.product.shippingInfo?.shippingCost || 0
        };
      }
      cartBySeller[sellerId].items.push(item);
      cartBySeller[sellerId].subtotal += item.price * item.quantity;
    });

    const { cartCount, cartTotal } = calculateCartTotals(user.cart);

    res.status(200).json({
      success: true,
      cart: user.cart,
      cartBySeller: Object.values(cartBySeller),
      cartCount,
      cartTotal
    });

  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message
    });
  }
};

export const getCartBySeller = async (req, res) => {
  try {
    const user = await getUser(req);

    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock colors sizes active seller shippingInfo',
      populate: {
        path: 'seller',
        select: 'name companyName phone email address city state country pincode'
      }
    });

    const activeCartItems = user.cart.filter(item => item.product && item.product.active);

    if (activeCartItems.length !== user.cart.length) {
      user.cart = activeCartItems;
      await user.save();
    }

    const cartBySeller = {};
    user.cart.forEach(item => {
      const sellerId = item.product.seller._id.toString();
      if (!cartBySeller[sellerId]) {
        cartBySeller[sellerId] = {
          seller: item.product.seller,
          items: [],
          subtotal: 0,
          shipping: item.product.shippingInfo?.shippingCost || 0,
          itemsCount: 0
        };
      }
      cartBySeller[sellerId].items.push({
        id: item._id,
        productId: item.product._id,
        name: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        price: item.price,
        images: item.product.images,
        stock: item.product.stock,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      });
      cartBySeller[sellerId].subtotal += item.price * item.quantity;
      cartBySeller[sellerId].itemsCount += item.quantity;
    });

    const { cartCount, cartTotal } = calculateCartTotals(user.cart);

    const result = {
      success: true,
      cart: user.cart,
      cartBySeller: Object.values(cartBySeller),
      summary: {
        items: cartCount,
        subtotal: cartTotal,
        shipping: Object.values(cartBySeller).reduce((sum, seller) => sum + seller.shipping, 0),
        tax: Math.round(cartTotal * 0.18),
        total: cartTotal + Object.values(cartBySeller).reduce((sum, seller) => sum + seller.shipping, 0) + Math.round(cartTotal * 0.18)
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Error getting cart by seller:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart by seller",
      error: error.message
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await getUser(req);

    const alreadyInWishlist = user.wishlist.some(item => 
      item.product.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
        wishlist: user.wishlist,
        wishlistCount: user.wishlist.length
      });
    }

    user.wishlist.push({ product: productId });
    await user.save();

    await user.populate({
      path: 'wishlist.product',
      select: 'name brand priceINR priceAED images stock active'
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
      wishlistCount: user.wishlist.length
    });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: error.message
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await getUser(req);

    const wishlistIndex = user.wishlist.findIndex(item => 
      item.product.toString() === productId
    );

    if (wishlistIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist"
      });
    }

    user.wishlist.splice(wishlistIndex, 1);
    await user.save();

    await user.populate({
      path: 'wishlist.product',
      select: 'name brand priceINR priceAED images stock active'
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
      wishlistCount: user.wishlist.length
    });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
      error: error.message
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await getUser(req);

    await user.populate({
      path: 'wishlist.product',
      select: 'name brand priceINR priceAED images stock active'
    });

    const activeWishlistItems = user.wishlist.filter(item => item.product && item.product.active);

    if (activeWishlistItems.length !== user.wishlist.length) {
      user.wishlist = activeWishlistItems;
      await user.save();
    }

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
      wishlistCount: user.wishlist.length
    });

  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get wishlist",
      error: error.message
    });
  }
};

export const moveToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, color, size } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const user = await getUser(req);

    const wishlistIndex = user.wishlist.findIndex(item => 
      item.product.toString() === productId
    );

    if (wishlistIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist"
      });
    }

    const product = await ProductModel.findById(productId).populate('seller');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
        availableStock: product.stock
      });
    }

    const existingCartItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId &&
      item.selectedColor === color &&
      item.selectedSize === size
    );

    if (existingCartItemIndex > -1) {
      const newQuantity = user.cart[existingCartItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: "Cannot add more items. Stock limit reached",
          availableStock: product.stock
        });
      }

      user.cart[existingCartItemIndex].quantity = newQuantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
        selectedColor: color,
        selectedSize: size,
        price: product.priceINR,
        seller: product.seller._id
      });
    }

    user.wishlist.splice(wishlistIndex, 1);

    await user.save();

    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock colors sizes seller',
      populate: {
        path: 'seller',
        select: 'name companyName'
      }
    });

    await user.populate({
      path: 'wishlist.product',
      select: 'name brand priceINR priceAED images stock'
    });

    const { cartCount, cartTotal } = calculateCartTotals(user.cart);

    res.status(200).json({
      success: true,
      message: "Product moved to cart",
      cart: user.cart,
      wishlist: user.wishlist,
      cartCount,
      wishlistCount: user.wishlist.length,
      cartTotal
    });

  } catch (error) {
    console.error('Error moving to cart:', error);
    res.status(500).json({
      success: false,
      message: "Failed to move product to cart",
      error: error.message
    });
  }
};

export const getCartSummary = async (req, res) => {
  try {
    const user = await getUser(req);

    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock active seller shippingInfo',
      populate: {
        path: 'seller',
        select: 'name companyName'
      }
    });

    const activeCartItems = user.cart.filter(item => item.product && item.product.active);

    if (activeCartItems.length !== user.cart.length) {
      user.cart = activeCartItems;
      await user.save();
    }

    const cartBySeller = {};
    let totalShipping = 0;
    
    user.cart.forEach(item => {
      const sellerId = item.product.seller._id.toString();
      if (!cartBySeller[sellerId]) {
        cartBySeller[sellerId] = {
          seller: item.product.seller,
          items: [],
          subtotal: 0,
          shipping: item.product.shippingInfo?.shippingCost || 0
        };
        totalShipping += cartBySeller[sellerId].shipping;
      }
      cartBySeller[sellerId].items.push({
        id: item._id,
        productId: item.product._id,
        name: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images?.image1,
        stock: item.product.stock,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      });
      cartBySeller[sellerId].subtotal += item.price * item.quantity;
    });

    const { cartCount, cartTotal } = calculateCartTotals(user.cart);
    
    const tax = Math.round(cartTotal * 0.18);
    const total = cartTotal + totalShipping + tax;

    const cartSummary = {
      items: cartCount,
      subtotal: cartTotal,
      shipping: totalShipping,
      tax,
      total,
      sellers: Object.values(cartBySeller)
    };

    res.status(200).json({
      success: true,
      summary: cartSummary
    });

  } catch (error) {
    console.error('Error getting cart summary:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart summary",
      error: error.message
    });
  }
};

// CREATE ORDER FUNCTION
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    const user = await getUser(req);
    
    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock seller shippingInfo',
      populate: {
        path: 'seller',
        select: 'name companyName email phone'
      }
    });

    if (!user.cart || user.cart.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const orderItems = [];
    const sellerItemsMap = new Map();
    let totalSubtotal = 0;
    let totalShipping = 0;
    let insufficientStockItems = [];

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      
      if (!product || !product.active) {
        insufficientStockItems.push({
          product: product?.name || "Unknown",
          reason: "Product not available"
        });
        continue;
      }

      if (product.stock < cartItem.quantity) {
        insufficientStockItems.push({
          product: product.name,
          reason: `Only ${product.stock} items available`
        });
        continue;
      }

      const itemSubtotal = cartItem.price * cartItem.quantity;
      const itemShipping = product.shippingInfo?.freeShipping ? 0 : (product.shippingInfo?.shippingCost || 0);
      
      const orderItem = {
        product: product._id,
        seller: product.seller._id,
        quantity: cartItem.quantity,
        price: cartItem.price,
        selectedColor: cartItem.selectedColor,
        selectedSize: cartItem.selectedSize,
        itemStatus: "pending",
        sellerStatus: "pending"
      };

      orderItems.push(orderItem);

      if (!sellerItemsMap.has(product.seller._id.toString())) {
        sellerItemsMap.set(product.seller._id.toString(), {
          seller: product.seller._id,
          items: [],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          sellerStatus: "pending"
        });
      }

      const sellerOrder = sellerItemsMap.get(product.seller._id.toString());
      sellerOrder.items.push(orderItem);
      sellerOrder.subtotal += itemSubtotal;
      sellerOrder.shipping += itemShipping;

      totalSubtotal += itemSubtotal;
      totalShipping += itemShipping;

      product.stock -= cartItem.quantity;
      product.soldCount += cartItem.quantity;
      await product.save({ session });
    }

    if (insufficientStockItems.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Some items are not available",
        unavailableItems: insufficientStockItems
      });
    }

    const tax = Math.round(totalSubtotal * 0.18);
    const total = totalSubtotal + totalShipping + tax;

    sellerItemsMap.forEach(sellerOrder => {
      sellerOrder.tax = Math.round(sellerOrder.subtotal * 0.18);
      sellerOrder.total = sellerOrder.subtotal + sellerOrder.shipping + sellerOrder.tax;
    });

    const generateOrderId = () => {
      return `ORD${Date.now()}${crypto.randomInt(1000, 9999)}`;
    };

    const order = new OrderModel({
      orderId: generateOrderId(),
      user: user._id,
      items: orderItems,
      sellerOrders: Array.from(sellerItemsMap.values()),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      subtotal: totalSubtotal,
      shipping: totalShipping,
      tax: tax,
      total: total,
      status: "pending",
      notes
    });

    await order.save({ session });

    user.cart = [];
    user.orders.push(order._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate order details for response
    await order.populate([
      {
        path: 'items.product',
        select: 'name brand images'
      },
      {
        path: 'items.seller',
        select: 'name email phone'
      },
      {
        path: 'sellerOrders.seller',
        select: 'name email phone'
      }
    ]);

    if (paymentMethod === 'razorpay') {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total * 100),
        currency: "INR",
        receipt: order.orderId,
        notes: {
          orderId: order.orderId,
          userId: user._id.toString()
        }
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order created successfully",
        order: order,
        razorpayOrder: razorpayOrder,
        key_id: process.env.RAZORPAY_KEY_ID
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Order created successfully. Pay on delivery.",
        order: order
      });
    }

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    const user = await getUser(req);

    const crypto = require('crypto');
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await OrderModel.findOne({ 
        orderId,
        user: user._id 
      });
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      order.paymentStatus = "completed";
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      order.status = "processing";
      
      await order.save();

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message
    });
  }
};