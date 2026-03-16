import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose"; // ✅ Add this
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import cartRoutes from "./routes/cart.js";
import adminProductRoutes from "./routes/adminProducts.js";

dotenv.config();

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/api/test", (req, res) => {
  res.send("Muse backend running 🚀");
});

// Error Handler
app.use(notFound);
app.use(errorHandler);
// Connect to MongoDB and start server
connectDB().catch((error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});