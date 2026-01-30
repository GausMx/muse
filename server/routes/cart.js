import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  syncCart
} from "../controllers/cart.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:variantId", protect, removeFromCart);
router.post("/sync", protect, syncCart);


export default router;
