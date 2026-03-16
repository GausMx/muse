import Product from "../models/Product.js";
import slugify from "slugify";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  const { name, description, category, basePrice, variants } = req.body;

  const images = req.files?.map(file => `/uploads/${file.filename}`);

  try {
    // Parse variants, handle empty array case
    let parsedVariants = [];
    if (variants && variants !== '[]') {
      parsedVariants = JSON.parse(variants);
    }

    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      category,
      basePrice,
      variants: parsedVariants,
      images,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ error: error.message });
  }
};

// GET ALL PRODUCTS (pagination + filters)
export const getProducts = async (req, res) => {
  const { page = 1, limit = 10, search, category } = req.query;

  const query = { isActive: true };

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  try {
    const products = await Product.find(query)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ total, page, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
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

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
};