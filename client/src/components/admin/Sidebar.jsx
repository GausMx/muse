import { Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function Sidebar() {
  const { logout } = useAdminAuth();
  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <nav className="flex flex-col space-y-3">
        <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/admin/products" className="hover:text-blue-400">Products</Link>
        <Link to="/admin/categories" className="hover:text-blue-400">Categories</Link>
        <Link to="/admin/orders" className="hover:text-blue-400">Orders</Link>
        <button onClick={logout} className="mt-auto bg-red-500 p-2 rounded hover:bg-red-600">Logout</button>
      </nav>
    </div>
  );
}
