import OrderModel from "../Model/OrderModel.js";
import ProductModel from "../Model/ProductModel.js";
import UserModel from "../Model/UserModel.js";
import SellerModel from "../Model/SellerModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
<<<<<<< HEAD
import { sendOrderConfirmationEmail, sendSellerNewOrderEmail } from "../utils/emailService.js";
import Razorpay from "razorpay";

=======
import emailService from "../Utils/emailService.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
const generateOrderId = () => {
  return `ORD${Date.now()}${crypto.randomInt(1000, 9999)}`;
};

<<<<<<< HEAD
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      const userId = req.user._id;
      const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;
  
      const user = await UserModel.findById(userId).session(session);
  
      await user.populate({
        path: 'cart.product',
        select: 'name brand priceINR priceAED images stock seller shippingInfo',
        populate: {
          path: 'seller',
          select: 'name companyName email phone'
        }
      });
  
      if (user.cart.length === 0) {
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
      const insufficientStockItems = [];
  
      for (const cartItem of user.cart) {
        const product = await ProductModel.findById(cartItem.product._id).session(session);
  
        if (!product) {
          insufficientStockItems.push({
            product: cartItem.product?.name || "Unknown",
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
          seller: product.seller,
          quantity: cartItem.quantity,
          price: cartItem.price,
          selectedColor: cartItem.selectedColor,
          selectedSize: cartItem.selectedSize,
          itemStatus: "pending",
          sellerStatus: "pending"
        };
  
        orderItems.push(orderItem);
  
        const sellerId = product.seller.toString();
        if (!sellerItemsMap.has(sellerId)) {
          sellerItemsMap.set(sellerId, {
            seller: product.seller,
            items: [],
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0
          });
        }
  
        const sellerOrder = sellerItemsMap.get(sellerId);
        sellerOrder.items.push(orderItem);
        sellerOrder.subtotal += itemSubtotal;
        sellerOrder.shipping += itemShipping;
  
        totalSubtotal += itemSubtotal;
        totalShipping += itemShipping;
  
        product.stock -= cartItem.quantity;
        product.soldCount = (product.soldCount || 0) + cartItem.quantity;
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
  
      const order = new OrderModel({
        orderId: generateOrderId(),
        user: userId,
        items: orderItems,
        sellerOrders: Array.from(sellerItemsMap.values()),
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
        subtotal: totalSubtotal,
        shipping: totalShipping,
        tax,
        total,
        status: "pending",
        notes
      });
  
      await order.save({ session });
  
      user.cart = [];
      user.orders.push(order._id);
      await user.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      await order.populate([
        { path: 'items.product', select: 'name brand images' },
        { path: 'items.seller', select: 'name email phone' },
        { path: 'sellerOrders.seller', select: 'name email phone' }
      ]);
  
      sendOrderConfirmationEmail(user.email, order)
        .catch(err => console.error("Order email failed:", err.message));
  
      sellerItemsMap.forEach(async (sellerOrder, sellerId) => {
        try {
          const seller = await SellerModel.findById(sellerId);
          if (seller?.email) {
            await sendSellerNewOrderEmail(seller.email, order, sellerOrder);
          }
        } catch (err) {
          console.error("Seller email failed:", err.message);
        }
      });
  
      if (paymentMethod === 'razorpay') {
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
            userId: userId.toString()
          }
        });
  
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();
  
        return res.status(200).json({
          success: true,
          message: "Order created successfully",
          order,
          razorpayOrder,
          key_id: process.env.RAZORPAY_KEY_ID
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Order created successfully. Pay on delivery.",
        order
      });
  
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
  
      console.error("Error creating order:", error);
  
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message
      });
    }
  };

export const verifyPayment = async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId
      } = req.body;
  
      const order = await OrderModel.findOne({ orderId });
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }
  
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed"
        });
      }
  
      order.paymentStatus = "completed";
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      order.status = "processing";
  
      await order.save();
  
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order
      });
  
    } catch (error) {
      console.error("Error verifying payment:", error);
      return res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error: error.message
      });
    }
  };
=======
const createTemporaryOrder = async (userId, orderData) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const { shippingAddress, billingAddress, paymentMethod, notes } = orderData;

    const user = await UserModel.findById(userId).session(session);

    await user.populate({
      path: 'cart.product',
      select: 'name brand priceINR priceAED images stock seller shippingInfo',
      populate: {
        path: 'seller',
        select: 'name companyName email phone'
      }
    });

    if (user.cart.length === 0) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Cart is empty");
    }

    const orderItems = [];
    const sellerItemsMap = new Map();
    let totalSubtotal = 0;
    let totalShipping = 0;
    const insufficientStockItems = [];

    for (const cartItem of user.cart) {
      const product = await ProductModel.findById(cartItem.product._id).session(session);

      if (!product) {
        insufficientStockItems.push({
          product: cartItem.product?.name || "Unknown",
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
        seller: product.seller,
        quantity: cartItem.quantity,
        price: cartItem.price,
        selectedColor: cartItem.selectedColor,
        selectedSize: cartItem.selectedSize,
        itemStatus: "pending",
        sellerStatus: "pending"
      };

      orderItems.push(orderItem);

      const sellerId = product.seller.toString();
      if (!sellerItemsMap.has(sellerId)) {
        sellerItemsMap.set(sellerId, {
          seller: product.seller,
          items: [],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0
        });
      }

      const sellerOrder = sellerItemsMap.get(sellerId);
      sellerOrder.items.push(orderItem);
      sellerOrder.subtotal += itemSubtotal;
      sellerOrder.shipping += itemShipping;

      totalSubtotal += itemSubtotal;
      totalShipping += itemShipping;

      product.stock -= cartItem.quantity;
      product.soldCount = (product.soldCount || 0) + cartItem.quantity;
      await product.save({ session });
    }

    if (insufficientStockItems.length > 0) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Some items are not available");
    }

    const tax = Math.round(totalSubtotal * 0.18);
    const total = totalSubtotal + totalShipping + tax;

    sellerItemsMap.forEach(sellerOrder => {
      sellerOrder.tax = Math.round(sellerOrder.subtotal * 0.18);
      sellerOrder.total = sellerOrder.subtotal + sellerOrder.shipping + sellerOrder.tax;
    });

    const temporaryOrderId = generateOrderId();
    const temporaryOrderData = {
      orderId: temporaryOrderId,
      user: userId,
      items: orderItems,
      sellerOrders: Array.from(sellerItemsMap.values()),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      subtotal: totalSubtotal,
      shipping: totalShipping,
      tax,
      total,
      status: "temporary",
      notes
    };

    const order = new OrderModel(temporaryOrderData);
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      order: await OrderModel.findById(order._id)
        .populate([
          { path: 'items.product', select: 'name brand images' },
          { path: 'items.seller', select: 'name email phone' },
          { path: 'sellerOrders.seller', select: 'name email phone' }
        ]),
      sellerItemsMap,
      user
    };

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

const finalizeOrder = async (orderId, userId, paymentDetails = null) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const order = await OrderModel.findOne({ 
      orderId,
      user: userId,
      status: "temporary"
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Temporary order not found");
    }

    if (paymentDetails) {
      order.paymentStatus = "completed";
      order.razorpayPaymentId = paymentDetails.razorpay_payment_id;
      order.razorpaySignature = paymentDetails.razorpay_signature;
    }

    order.status = "processing";
    order.paymentStatus = paymentDetails ? "completed" : "pending";

    await order.save({ session });

    const user = await UserModel.findById(userId).session(session);
    user.cart = [];
    user.orders.push(order._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    await order.populate([
      { path: 'items.product', select: 'name brand images' },
      { path: 'items.seller', select: 'name email phone' },
      { path: 'sellerOrders.seller', select: 'name email phone' }
    ]);

    emailService.sendOrderConfirmationEmail(user.email, order)
      .catch(err => console.error("Order email failed:", err.message));

    order.sellerOrders.forEach(async (sellerOrder) => {
      try {
        const seller = await SellerModel.findById(sellerOrder.seller);
        if (seller?.email) {
          await emailService.sendSellerNewOrderEmail(seller.email, order, sellerOrder);
        }
      } catch (err) {
        console.error("Seller email failed:", err.message);
      }
    });

    return order;

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    
    await rollbackTemporaryOrder(orderId);
    throw error;
  }
};

const rollbackTemporaryOrder = async (orderId) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const order = await OrderModel.findOne({ orderId }).session(session);
    
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    for (const item of order.items) {
      const product = await ProductModel.findById(item.product).session(session);
      if (product) {
        product.stock += item.quantity;
        product.soldCount -= item.quantity;
        await product.save({ session });
      }
    }

    await OrderModel.deleteOne({ _id: order._id }).session(session);

    await session.commitTransaction();
    session.endSession();

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Error rolling back temporary order:", error);
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    if (paymentMethod === 'cod') {
      const result = await createTemporaryOrder(userId, req.body);
      const finalizedOrder = await finalizeOrder(result.order.orderId, userId);
      
      return res.status(200).json({
        success: true,
        message: "COD order created successfully",
        order: finalizedOrder
      });
    }

    if (paymentMethod === 'razorpay') {
      const result = await createTemporaryOrder(userId, req.body);
      
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(result.order.total * 100),
        currency: "INR",
        receipt: result.order.orderId,
        notes: {
          orderId: result.order.orderId,
          userId: userId.toString()
        }
      });

      result.order.razorpayOrderId = razorpayOrder.id;
      await result.order.save();

      return res.status(200).json({
        success: true,
        message: "Razorpay order created",
        razorpayOrder,
        key_id: process.env.RAZORPAY_KEY_ID,
        orderId: result.order.orderId
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid payment method"
    });

  } catch (error) {
    console.error("Error creating order:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const order = await OrderModel.findOne({ 
      orderId,
      status: "temporary"
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Temporary order not found or already processed"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await rollbackTemporaryOrder(orderId);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    const paymentDetails = {
      razorpay_payment_id,
      razorpay_signature
    };

    const finalizedOrder = await finalizeOrder(orderId, order.user.toString(), paymentDetails);

    return res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed successfully",
      order: finalizedOrder
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};

export const createPaymentForExistingOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    const order = await OrderModel.findOne({ orderId, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed"
      });
    }

    if (order.paymentMethod !== "razorpay") {
      return res.status(400).json({
        success: false,
        message: "Only Razorpay orders can be paid later"
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: "INR",
      receipt: `order_rcpt_${orderId}_${Date.now()}`,
      notes: {
        orderId: orderId,
        userId: userId.toString()
      }
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      razorpayOrder: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Error creating payment for existing order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message
    });
  }
};
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await OrderModel.findOne({ 
      orderId,
      user: userId 
    })
    .populate({
      path: 'items.product',
      select: 'name brand images'
    })
    .populate({
      path: 'items.seller',
      select: 'name companyName phone email'
    })
    .populate({
      path: 'sellerOrders.seller',
      select: 'name companyName phone email'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message
    });
  }
};

export const getUserOrders = async (req, res) => {
<<<<<<< HEAD
    try {
      const userId = req.user._id;
  
      const orders = await OrderModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: 'items.product',
          select: 'name brand images priceINR priceAED'
        })
        .populate({
          path: 'items.seller',
          select: 'name companyName'
        })
        .populate({
          path: 'sellerOrders.seller',
          select: 'name companyName'
        });
  
      const formattedOrders = orders.map(order => ({
        _id: order._id,
        orderId: order.orderId,
        createdAt: order.createdAt,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.total,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        itemsCount: order.items?.length || 0,
        items: order.items?.map(item => ({
          _id: item._id,
          product: item.product
            ? {
                _id: item.product._id,
                name: item.product.name,
                brand: item.product.brand,
                images: item.product.images,
                priceINR: item.product.priceINR,
                priceAED: item.product.priceAED
              }
            : null,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          itemStatus: item.itemStatus,
          sellerStatus: item.sellerStatus,
          cancellationReason: item.cancellationReason,
          returnStatus: item.returnStatus,
          returnReason: item.returnReason
        })) || [],
        sellers: order.sellerOrders?.map(so => ({
          name: so.seller?.name || "Unknown Seller",
          status: so.sellerStatus || "pending"
        })) || [],
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress
      }));
  
      res.status(200).json({
        success: true,
        orders: formattedOrders,
        count: formattedOrders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get orders",
        error: error.message
      });
    }
  };
=======
  try {
    const userId = req.user._id;

    const orders = await OrderModel.find({ 
      user: userId,
      status: { $ne: "temporary" }
    })
    .sort({ createdAt: -1 })
    .populate({
      path: 'items.product',
      select: 'name brand images priceINR priceAED'
    })
    .populate({
      path: 'items.seller',
      select: 'name companyName'
    })
    .populate({
      path: 'sellerOrders.seller',
      select: 'name companyName'
    });

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      createdAt: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      itemsCount: order.items?.length || 0,
      items: order.items?.map(item => ({
        _id: item._id,
        product: item.product
          ? {
              _id: item.product._id,
              name: item.product.name,
              brand: item.product.brand,
              images: item.product.images,
              priceINR: item.product.priceINR,
              priceAED: item.product.priceAED
            }
          : null,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        itemStatus: item.itemStatus,
        sellerStatus: item.sellerStatus,
        cancellationReason: item.cancellationReason,
        returnStatus: item.returnStatus,
        returnReason: item.returnReason
      })) || [],
      sellers: order.sellerOrders?.map(so => ({
        name: so.seller?.name || "Unknown Seller",
        status: so.sellerStatus || "pending"
      })) || [],
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders,
      count: formattedOrders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message
    });
  }
};
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await OrderModel.findOne({ 
      orderId,
<<<<<<< HEAD
      user: userId 
=======
      user: userId,
      status: { $ne: "temporary" }
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    })
    .populate([
      {
        path: 'items.product',
        select: 'name brand images description priceINR priceAED stock'
      },
      {
        path: 'items.seller',
        select: 'name companyName phone email address'
      },
      {
        path: 'sellerOrders.seller',
        select: 'name companyName phone email'
      }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const orderBySeller = {};
    order.sellerOrders.forEach(sellerOrder => {
      const sellerId = sellerOrder.seller._id.toString();
      orderBySeller[sellerId] = {
        seller: sellerOrder.seller,
        items: order.items.filter(item => 
          item.seller._id.toString() === sellerId
        ),
        subtotal: sellerOrder.subtotal,
        shipping: sellerOrder.shipping,
        tax: sellerOrder.tax,
        total: sellerOrder.total,
        status: sellerOrder.sellerStatus,
        trackingNumber: sellerOrder.trackingNumber,
        shippedAt: sellerOrder.shippedAt
      };
    });

    const responseData = {
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item.toObject(),
        canCancel: item.itemStatus === "pending",
        canReturn: item.itemStatus === "delivered" && !item.returnStatus
      })),
      orderBySeller: Object.values(orderBySeller)
    };

    res.status(200).json({
      success: true,
      order: responseData
    });

  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get order details",
      error: error.message
    });
  }
};

export const cancelOrderItem = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { itemId, reason } = req.body;
    const userId = req.user._id;

    const order = await OrderModel.findOne({ 
      orderId,
<<<<<<< HEAD
      user: userId 
=======
      user: userId,
      status: { $ne: "temporary" }
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const orderItem = order.items.id(itemId);
    if (!orderItem) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Order item not found"
      });
    }

    if (!["pending", "processing"].includes(orderItem.itemStatus)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Item cannot be cancelled at this stage"
      });
    }

    const product = await ProductModel.findById(orderItem.product).session(session);
    if (product) {
      product.stock += orderItem.quantity;
      product.soldCount -= orderItem.quantity;
      await product.save({ session });
    }

    orderItem.itemStatus = "cancelled";
    orderItem.cancellationReason = reason;

    const allItemsCancelled = order.items.every(item => 
      item.itemStatus === "cancelled"
    );

    if (allItemsCancelled) {
      order.status = "cancelled";
      order.cancellationReason = reason;
    }

    if (order.paymentMethod === 'razorpay' && order.paymentStatus === 'completed') {
      const refundAmount = orderItem.price * orderItem.quantity;
      order.refundAmount = (order.refundAmount || 0) + refundAmount;
      
      if (order.refundAmount === order.total) {
        order.paymentStatus = 'refunded';
      } else {
        order.paymentStatus = 'partially_refunded';
      }
    }

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    await order.populate([
      { path: 'items.product', select: 'name brand images' },
      { path: 'items.seller', select: 'name companyName' }
    ]);

    res.status(200).json({
      success: true,
      message: "Item cancelled successfully",
      order: order
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error cancelling order item:', error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel item",
      error: error.message
    });
  }
};

export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const order = await OrderModel.findOne({ 
      orderId,
<<<<<<< HEAD
      user: userId 
=======
      user: userId,
      status: { $ne: "temporary" }
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (!["pending", "processing"].includes(order.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage"
      });
    }

    for (const item of order.items) {
      if (item.itemStatus === "pending" || item.itemStatus === "processing") {
        const product = await ProductModel.findById(item.product).session(session);
        if (product) {
          product.stock += item.quantity;
          product.soldCount -= item.quantity;
          await product.save({ session });
        }
        item.itemStatus = "cancelled";
        item.cancellationReason = reason;
      }
    }
    
    order.status = "cancelled";
    order.cancellationReason = reason;

    if (order.paymentMethod === 'razorpay' && order.paymentStatus === 'completed') {
      order.paymentStatus = 'refunded';
      order.refundAmount = order.total;
    }

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    await order.populate([
      { path: 'items.product', select: 'name brand images' },
      { path: 'items.seller', select: 'name companyName' }
    ]);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: order
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, reason } = req.body;
    const userId = req.user._id;

    const order = await OrderModel.findOne({ 
      orderId,
<<<<<<< HEAD
      user: userId 
=======
      user: userId,
      status: { $ne: "temporary" }
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const orderItem = order.items.id(itemId);
    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: "Order item not found"
      });
    }

    if (orderItem.itemStatus !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered items can be returned"
      });
    }

    if (orderItem.returnStatus) {
      return res.status(400).json({
        success: false,
        message: "Return already requested for this item"
      });
    }

    const deliveredDate = orderItem.actualDeliveryDate || order.updatedAt;
    const daysSinceDelivery = Math.floor((new Date() - new Date(deliveredDate)) / (1000 * 60 * 60 * 24));

    if (daysSinceDelivery > 30) {
      return res.status(400).json({
        success: false,
        message: "Return window has expired (30 days)"
      });
    }

    orderItem.returnStatus = "requested";
    orderItem.returnReason = reason;

    const hasAnyReturn = order.items.some(item => item.returnStatus);
    if (hasAnyReturn) {
      order.status = "returned";
    }

    await order.save();

    await order.populate([
      { path: 'items.product', select: 'name brand images' },
      { path: 'items.seller', select: 'name companyName' }
    ]);

    res.status(200).json({
      success: true,
      message: "Return requested successfully",
      order: order
    });

  } catch (error) {
    console.error('Error requesting return:', error);
    res.status(500).json({
      success: false,
      message: "Failed to request return",
      error: error.message
    });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await OrderModel.findOne({ 
      orderId,
<<<<<<< HEAD
      user: userId 
=======
      user: userId,
      status: { $ne: "temporary" }
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    })
    .populate({
      path: 'items.product',
      select: 'name brand images'
    })
    .populate({
      path: 'items.seller',
      select: 'name phone email'
    })
    .populate({
      path: 'sellerOrders.seller',
      select: 'name'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const trackingInfo = {
      orderId: order.orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      estimatedDelivery: order.items[0]?.estimatedDeliveryDate,
      shippingAddress: order.shippingAddress,
      items: order.items.map(item => ({
        product: item.product,
        seller: item.seller,
        quantity: item.quantity,
        status: item.itemStatus,
        trackingNumber: item.trackingNumber,
        shippingProvider: item.shippingProvider,
        estimatedDelivery: item.estimatedDeliveryDate,
        actualDeliveryDate: item.actualDeliveryDate
      })),
      sellerOrders: order.sellerOrders.map(so => ({
        seller: so.seller,
        status: so.sellerStatus,
        trackingNumber: so.trackingNumber,
        shippedAt: so.shippedAt
      }))
    };

    res.status(200).json({
      success: true,
      tracking: trackingInfo
    });

  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to track order",
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, itemId, status, trackingNumber, shippingProvider, sellerNotes } = req.body;
    const sellerId = req.seller._id;

<<<<<<< HEAD
    const order = await OrderModel.findOne({ orderId });
=======
    const order = await OrderModel.findOne({ 
      orderId,
      status: { $ne: "temporary" }
    });
>>>>>>> 74c9384bf38b2180d20dafae9683580e612f07ff
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const sellerOrder = order.sellerOrders.find(so => 
      so.seller.toString() === sellerId.toString()
    );

    if (!sellerOrder) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order"
      });
    }

    if (itemId) {
      const orderItem = order.items.id(itemId);
      if (orderItem && orderItem.seller.toString() === sellerId.toString()) {
        orderItem.itemStatus = status;
        orderItem.sellerStatus = status;
        
        if (status === "shipped" && trackingNumber) {
          orderItem.trackingNumber = trackingNumber;
          orderItem.shippingProvider = shippingProvider;
          orderItem.estimatedDeliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
        
        if (status === "delivered") {
          orderItem.actualDeliveryDate = new Date();
        }
        
        if (sellerNotes) {
          orderItem.sellerNotes = sellerNotes;
        }
      }
    } else {
      sellerOrder.sellerStatus = status;
      if (status === "shipped" && trackingNumber) {
        sellerOrder.trackingNumber = trackingNumber;
        sellerOrder.shippedAt = new Date();
      }
      if (sellerNotes) {
        sellerOrder.sellerNotes = sellerNotes;
      }
    }

    const allItemsShipped = order.items.every(item => 
      item.itemStatus === "shipped" || item.itemStatus === "delivered" || item.itemStatus === "cancelled"
    );

    if (allItemsShipped) {
      order.status = "shipped";
    }

    const allItemsDelivered = order.items.every(item => 
      item.itemStatus === "delivered" || item.itemStatus === "cancelled"
    );

    if (allItemsDelivered) {
      order.status = "delivered";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};