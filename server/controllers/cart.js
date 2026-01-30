import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate("items.product");

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    // STOCK CHECK
    if (variant.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [{ product: productId, variantId, quantity }],
      });
    } else {
      const item = cart.items.find(
        i => i.variantId.toString() === variantId
      );

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ product: productId, variantId, quantity });
      }
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// SYNC CART
export const syncCart = async (req, res) => {
  try {
    const { items } = req.body; // array of { productId, variantId, quantity }
    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items,
      });
    } else {
      items.forEach(item => {
        const existing = cart.items.find(i => i.variantId.toString() === item.variantId);
        if (existing) existing.quantity += item.quantity;
        else cart.items.push(item);
      });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      i => i.variantId.toString() !== req.params.variantId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
