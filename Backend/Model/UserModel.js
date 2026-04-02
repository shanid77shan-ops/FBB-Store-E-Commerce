import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    password: {
      type: String
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String,
      default: null
    },

    otpExpiry: {
      type: Date,
      default: null
    },

    address: {
      shipping: {
        street: String,
        city: String,
        state: String,
        country: { type: String, default: "India" },
        pincode: String,
        phone: String
      },
      billing: {
        street: String,
        city: String,
        state: String,
        country: { type: String, default: "India" },
        pincode: String,
        phone: String
      }
    },

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        },
        selectedColor: String,
        selectedSize: String,
        price: Number,
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    wishlist: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      }
    ],

    preferences: {
      region: {
        type: String,
        enum: ["IN", "AE"],
        default: "IN"
      },
      currency: {
        type: String,
        enum: ["INR", "AED"],
        default: "INR"
      },
      notifications: {
        email: { type: Boolean, default: true },
        whatsapp: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      }
    },

    deviceId: {
      type: String,
      index: true
    },

    sessionToken: {
      type: String,
      index: true
    },

    lastActive: {
      type: Date,
      default: Date.now
    },

    isGuest: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/* Indexes */
UserSchema.index({ deviceId: 1, isGuest: 1 });
UserSchema.index({ sessionToken: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

/* Virtuals */
UserSchema.virtual("cartTotal").get(function () {
  if (!this.cart || this.cart.length === 0) return 0;
  return this.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

UserSchema.virtual("cartCount").get(function () {
  if (!this.cart) return 0;
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

UserSchema.virtual("wishlistCount").get(function () {
  return this.wishlist ? this.wishlist.length : 0;
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
