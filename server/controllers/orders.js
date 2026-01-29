import Product from "../models/Product.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  // items = [{ product, variantId, quantity }]

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) throw new Error("Product not found");

      const variant = product.variants.id(item.variantId);
      if (!variant) throw new Error("Variant not found");

      // 🔴 STOCK VALIDATION
      if (variant.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name} (${variant.size}/${variant.color})`
        );
      }

      // 🔻 STOCK REDUCTION
      variant.stock -= item.quantity;

      total += variant.price * item.quantity;

      orderItems.push({
        product: product._id,
        variant: item.variantId,
        quantity: item.quantity,
        price: variant.price,
      });

      await product.save({ session });
    }

    const order = await Order.create(
      [
        {
          user: req.user.userId,
          items: orderItems,
          total,
          shippingAddress,
          paymentMethod,
          status: "pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};
