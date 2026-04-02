import Razorpay from "razorpay";
import crypto from "crypto";
import OrderModel from "../Model/OrderModel.js";
import ProductModel from "../Model/ProductModel.js";
import UserModel from "../Model/UserModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
  try {
    const { deviceId, sessionToken } = req.cookies || {};
    const { shippingAddress, billingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }

    let user = await UserModel.findOne({
      $or: [
        { deviceId, isGuest: true },
        { sessionToken }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await user.populate({
      path: 'cart.product',
      select: 'name priceINR stock'
    });

    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    for (const item of user.cart) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`,
          product: item.product.name
        });
      }
    }

    const subtotal = user.cartTotal;
    const shipping = subtotal > 5000 ? 0 : 100;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const orderData = {
      amount: total * 100,
      currency: "INR",
      receipt: orderId,
      payment_capture: 1
    };

    let razorpayOrder;
    if (paymentMethod === "razorpay") {
      razorpayOrder = await razorpay.orders.create(orderData);
    }

    const order = new OrderModel({
      orderId,
      user: user._id,
      items: user.cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      })),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      razorpayOrderId: razorpayOrder?.id,
      subtotal,
      shipping,
      tax,
      total,
      status: "pending"
    });

    await order.save();

    if (paymentMethod === "cod") {
      await updateStockAndClearCart(user);
    }

    res.status(200).json({
      success: true,
      order,
      razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
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

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    const order = await OrderModel.findOne({ orderId });
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

    const { deviceId, sessionToken } = req.cookies || {};
    let user = await UserModel.findOne({
      $or: [
        { deviceId, isGuest: true },
        { sessionToken }
      ]
    });

    if (user) {
      await updateStockAndClearCart(user);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { deviceId, sessionToken } = req.cookies || {};
    
    let user = await UserModel.findOne({
      $or: [
        { deviceId, isGuest: true },
        { sessionToken }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const orders = await OrderModel.find({ user: user._id })
      .populate({
        path: 'items.product',
        select: 'name brand images'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deviceId, sessionToken } = req.cookies || {};
    
    let user = await UserModel.findOne({
      $or: [
        { deviceId, isGuest: true },
        { sessionToken }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const order = await OrderModel.findOne({
      orderId,
      user: user._id
    }).populate({
      path: 'items.product',
      select: 'name brand priceINR images'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message
    });
  }
};

async function updateStockAndClearCart(user) {
  for (const item of user.cart) {
    await ProductModel.findByIdAndUpdate(
      item.product._id,
      { $inc: { stock: -item.quantity } }
    );
  }
  
  user.cart = [];
  await user.save();
}