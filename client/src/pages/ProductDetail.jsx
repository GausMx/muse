import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${slug}`).then(res => setProduct(res.data));
  }, [slug]);

  if (!product) return <p>Loading...</p>;

  const sizes = [...new Set(product.variants.map(v => v.size))];
  const colors = [...new Set(product.variants.map(v => v.color))];

  const selectedVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="md:w-1/2">
          <img src={product.images[0]} alt={product.name} className="w-full h-96 object-cover rounded"/>
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>

          {/* Variant selectors */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-semibold">Size:</label>
              <select className="border p-2 rounded w-full" value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                <option value="">Select size</option>
                {sizes.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Color:</label>
              <select className="border p-2 rounded w-full" value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
                <option value="">Select color</option>
                {colors.map(color => <option key={color} value={color}>{color}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Stock */}
          {selectedVariant && (
            <div className="mt-4">
              <p className="text-xl font-bold text-blue-500">Price: ${selectedVariant.price}</p>
              <p className={`mt-1 ${selectedVariant.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : "Out of stock"}
              </p>
              <button 
                onClick={() => addToCart({ productId: product._id, variantId: selectedVariant._id })}
                disabled={selectedVariant.stock === 0}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
