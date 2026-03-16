import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const createCategory = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    // Generate slug in controller instead of model
    const slug = req.body.name.toLowerCase().replace(/\s+/g, "-");

    const category = await Category.create({
      name: req.body.name,
      slug: slug,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      description: req.body.description,
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    // Generate new slug if name changed
    if (req.body.name && req.body.name !== category.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/\s+/g, "-");
    }

    Object.assign(category, req.body);
    if (req.file) category.image = `/uploads/${req.file.filename}`;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.id,
      isActive: true,
    });
    res.json(products);
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ message: error.message });
  }
};