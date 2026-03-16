import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  variantId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    orderNumber: { 
      type: String, 
      unique: true,
      sparse: true 
    },
    items: [orderItemSchema],
    total: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
      default: "Pending" 
    },
    shippingAddress: shippingAddressSchema,
    paymentMethod: { 
      type: String, 
      enum: ["card", "bank_transfer", "ussd"], 
      required: true 
    },
    paymentReference: { 
      type: String 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "failed"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
});

export default mongoose.model("Order", orderSchema);