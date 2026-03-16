import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetail";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import CategoriesAdmin from "./pages/admin/Categories";
import OrdersAdmin from "./pages/admin/Orders";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";

// Admin auth guard
function AdminAuthGuard({ children }) {
  const { admin } = useAdminAuth();
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

// Admin layout wrapper
function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<AdminAuthGuard><Dashboard /></AdminAuthGuard>} />
        <Route path="products" element={<AdminAuthGuard><ProductsAdmin /></AdminAuthGuard>} />
        <Route path="categories" element={<AdminAuthGuard><CategoriesAdmin /></AdminAuthGuard>} />
        <Route path="orders" element={<AdminAuthGuard><OrdersAdmin /></AdminAuthGuard>} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public/User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin Routes - single provider wrapper */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </>
  );
}