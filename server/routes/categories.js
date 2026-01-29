import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getProductsByCategory
} from "../controllers/categories.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id/products", getProductsByCategory);

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createCategory
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateCategory
);

router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
