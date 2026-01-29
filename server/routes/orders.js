import express from "express";
import { createOrder } from "../controllers/orders.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);

export default router;
