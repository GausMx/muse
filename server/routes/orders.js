import express from "express";
import { createOrder } from "../controllers/orders.js";
import { protect, admin } from "../middleware/auth.js";
import Order from "../models/Order.js";

const router = express.Router();

// User: Create order
router.post("/", protect, (req, res, next) => {
  console.log("POST /api/orders hit!");
  console.log("User:", req.user);
  console.log("Body:", req.body);
  next();
}, createOrder);

// User: Get their own orders (MUST come BEFORE "GET /")
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update order status (specific ID route BEFORE "GET /")
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all orders (MUST come LAST to avoid catching other routes)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;