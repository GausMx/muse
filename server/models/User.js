// server/models/User.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
