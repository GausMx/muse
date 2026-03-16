import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ product, variant }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addToCart({
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      image: product.images?.[0],
      price: variant.price || product.basePrice,
      quantity: qty,
      variantName: variant.name,
    });
  };

  return (
    <div className="flex gap-3">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={e => setQty(Number(e.target.value))}
        className="w-20 border rounded-xl p-2"
      />
      <button
        onClick={handleAdd}
        className="bg-black text-white px-5 py-2 rounded-2xl"
      >
        Add to Cart
      </button>
    </div>
  );
}
