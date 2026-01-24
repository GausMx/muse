// server/models/Product.js
import mongoose from "mongoose";
import { variantSchema } from "./Variant.js"; // or define inline

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true }, // optional unique SKU
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    basePrice: { type: Number, required: true },
    images: [String], // URLs
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
