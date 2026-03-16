import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: String,
    image: String,
    description: String,
  },
  { timestamps: true }
);

// NO PRE-SAVE HOOK AT ALL

export default mongoose.model("Category", categorySchema);