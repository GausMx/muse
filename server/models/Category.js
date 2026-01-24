// server/models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // URL or S3 path
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
