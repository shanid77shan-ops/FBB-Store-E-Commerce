import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    selectedColor: String,
    selectedSize: String,
    itemStatus: {
      type: String,
      enum: ["pending", "processing", "packed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending"
    },
    sellerStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", "preparing", "ready_for_dispatch"],
      default: "pending"
    },
    trackingNumber: String,
    shippingProvider: String,
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    sellerNotes: String,
    cancellationReason: String,
    returnReason: String,
    returnStatus: {
      type: String,
      enum: ["requested", "approved", "rejected", "picked_up", "refunded"],
      default: null
    }
  },
  { timestamps: true }
);

const SellerOrderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    sellerStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", "processing", "completed"],
      default: "pending"
    }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    sellerOrders: {
      type: [SellerOrderSchema],
      required: true
    },
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    billingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "partially_refunded"],
      default: "pending"
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "processing", "partially_shipped", "shipped", "delivered", "cancelled", "returned"],
      default: "pending"
    },
    notes: String,
    cancellationReason: String,
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;
