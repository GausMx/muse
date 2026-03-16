import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  syncCart,
  updateCartItem
} from "../controllers/cart.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:variantId", protect, removeFromCart);
router.post("/sync", protect, syncCart);
router.put("/:variantId", protect, updateCartItem);


export default router;
