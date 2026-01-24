// server/models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant: { type: mongoose.Schema.Types.ObjectId },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderNumber: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    paymentMethod: { type: String, enum: ["card", "paypal", "cod"], default: "card" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
