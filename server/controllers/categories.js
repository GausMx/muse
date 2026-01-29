import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const createCategory = async (req, res) => {
  const category = await Category.create({
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : null,
  });
  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });

  Object.assign(category, req.body);
  if (req.file) category.image = `/uploads/${req.file.filename}`;

  await category.save();
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};

export const getProductsByCategory = async (req, res) => {
  const products = await Product.find({
    category: req.params.id,
    isActive: true,
  });
  res.json(products);
};
