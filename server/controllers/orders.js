import Order from "../models/Order.js";
import Product from "../models/Product.js";

// CREATE ORDER (from checkout)
export const createOrder = async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod, paymentReference, paymentStatus } = req.body;

    // Validate stock before creating order
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      if (item.variantId) {
        const variant = product.variants.id(item.variantId);
        if (!variant) {
          return res.status(404).json({ message: "Variant not found" });
        }
        if (variant.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${product.name}. Only ${variant.stock} available.` 
          });
        }
      } else {
        // Product without variants
        if ((product.stock || 0) < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${product.name}. Only ${product.stock} available.` 
          });
        }
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      shippingAddress,
      paymentMethod,
      paymentReference,
      paymentStatus: paymentStatus || "pending",
      status: "Pending"
    });

    // Reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (item.variantId) {
        const variant = product.variants.id(item.variantId);
        variant.stock -= item.quantity;
      } else {
        product.stock -= item.quantity;
      }
      
      await product.save();
    }

    // Populate product details before returning
    await order.populate('items.product');

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET USER'S ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL ORDERS (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE ORDER
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Users can only view their own orders, admins can view all
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ORDER STATUS (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CANCEL ORDER (User can cancel if status is Pending)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check authorization
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Can only cancel pending orders
    if (order.status !== "Pending") {
      return res.status(400).json({ 
        message: "Can only cancel orders with Pending status" 
      });
    }

    order.status = "Cancelled";
    await order.save();

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      
      if (item.variantId) {
        const variant = product.variants.id(item.variantId);
        variant.stock += item.quantity;
      } else {
        product.stock += item.quantity;
      }
      
      await product.save();
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};