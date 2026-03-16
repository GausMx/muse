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

    // Handle products without variants (variantId is null)
    if (!variantId) {
      // Product without variants - check product-level stock
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }
    } else {
      // Product with variants - check variant stock
      const variant = product.variants.id(variantId);
      if (!variant) return res.status(404).json({ message: "Variant not found" });

      if (variant.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [{ product: productId, variantId: variantId || productId, quantity }],
      });
    } else {
      const item = cart.items.find(
        i => i.variantId.toString() === (variantId || productId).toString()
      );

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ product: productId, variantId: variantId || productId, quantity });
      }
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: err.message });
  }
};

// SYNC CART
export const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid cart items" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      // Create new cart
      const validItems = [];
      
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        // Handle products with or without variants
        const variantId = item.variantId || item.productId;
        
        if (item.variantId) {
          const variant = product.variants.id(item.variantId);
          if (!variant) continue;
          if (variant.stock < item.quantity) continue;
        } else {
          if ((product.stock || 0) < item.quantity) continue;
        }

        validItems.push({
          product: item.productId,
          variantId: variantId,
          quantity: item.quantity
        });
      }

      cart = await Cart.create({
        user: req.user.userId,
        items: validItems,
      });
    } else {
      // Merge with existing cart
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        const variantId = item.variantId || item.productId;

        if (item.variantId) {
          const variant = product.variants.id(item.variantId);
          if (!variant) continue;
          if (variant.stock < item.quantity) continue;
        } else {
          if ((product.stock || 0) < item.quantity) continue;
        }

        const existing = cart.items.find(
          i => i.variantId.toString() === variantId.toString()
        );

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          cart.items.push({
            product: item.productId,
            variantId: variantId,
            quantity: item.quantity
          });
        }
      }

      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error('Sync cart error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      i => i.variantId.toString() === req.params.variantId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

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