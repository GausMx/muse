import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { Link, useSearchParams } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  const fetchProducts = () => {
    const params = {
      page,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || ""
    };
    api.get("/products", { params }).then(res => {
      setProducts(res.data.products);
      setTotal(res.data.total);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchParams]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Link to={`/products/${product.slug}`} key={product._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <img src={product.images[0]} alt={product.name} className="h-48 w-full object-cover"/>
            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-blue-500 font-bold mt-2">${product.basePrice}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Prev</button>
        <span className="px-4 py-2">{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
