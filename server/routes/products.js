import express from "express";
import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

import { protect, admin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 5),
  updateProduct
);

router.delete("/:id", protect, admin, deleteProduct);

export default router;
    