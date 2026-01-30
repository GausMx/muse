import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
    api.get("/products", { params: { limit: 6 } }).then(res => setFeatured(res.data.products));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="h-96 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Muse Store</h1>
        <p className="text-lg mb-6">Find your perfect product</p>
        <Link to="/products" className="px-6 py-3 bg-white text-blue-500 rounded font-semibold hover:bg-gray-100 transition">
          Shop Now
        </Link>
      </div>

      {/* Featured Products */}
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {featured.map(product => (
          <Link to={`/products/${product.slug}`} key={product._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <img src={product.images[0]} alt={product.name} className="h-48 w-full object-cover"/>
            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-blue-500 font-bold mt-2">${product.basePrice}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(cat => (
          <Link to={`/products?category=${cat._id}`} key={cat._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col items-center p-4">
            {cat.image && <img src={cat.image} alt={cat.name} className="h-32 w-full object-cover mb-2"/>}
            <h3 className="font-semibold text-center">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
