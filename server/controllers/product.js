import Product from "../models/Product.js";
import slugify from "slugify";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  const { name, description, category, basePrice, variants } = req.body;

  const images = req.files?.map(file => `/uploads/${file.filename}`);

  try {
      const product = await Product.create({
    name,
    slug: slugify(name, { lower: true }),
    description,
    category,
    basePrice,
    variants: JSON.parse(variants),
    images,
  });
  res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL PRODUCTS (pagination + filters)
export const getProducts = async (req, res) => {
  const { page = 1, limit = 10, search, category } = req.query;

  const query = { isActive: true };

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  const products = await Product.find(query)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.json({ total, page, products });
};

// GET SINGLE PRODUCT
export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category");

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  const updates = req.body;

  if (updates.name) {
    updates.slug = slugify(updates.name, { lower: true });
  }

  if (req.files?.length) {
    updates.images = req.files.map(file => `/uploads/${file.filename}`);
  }

  if (updates.variants) {
    updates.variants = JSON.parse(updates.variants);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  );

  res.json(product);
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
