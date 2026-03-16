import { createContext, useContext, useState } from "react"; 
import { useCart } from "./CartContext.jsx";
import api from "../utils/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") return null; // ✅ Check for "undefined" string
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const { cart, clearCart, setCart } = useCart();

  const login = async (data) => {
    if (!data.token || !data.user) {
      console.error("Invalid login data:", data);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    // Sync localStorage cart to backend
    if (cart.length > 0) {
      try {
        await api.post("/cart/sync", {
          items: cart.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        });

        const cartRes = await api.get("/cart");

        const mapped = cartRes.data.items.map(i => {
          const variant = i.product.variants.find(v => v._id === i.variantId);
          return {
            productId: i.product._id,
            variantId: i.variantId,
            quantity: i.quantity,
            name: i.product.name,
            image: i.product.images[0],
            price: variant?.price || i.product.basePrice,
          };
        });

        setCart(mapped);
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};