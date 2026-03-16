import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in (from localStorage token)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Listen for storage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom login/logout events
    window.addEventListener('login', handleStorageChange);
    window.addEventListener('logout', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleStorageChange);
      window.removeEventListener('logout', handleStorageChange);
    };
  }, []);

  // Fetch cart on mount and when login state changes
  useEffect(() => {
    if (isLoggedIn) {
      // Logged in - fetch from backend
      api.get("/cart")
        .then(res => {
          setCart(res.data || { items: [] });
        })
        .catch(err => {
          console.error("Fetch cart error:", err);
          setCart({ items: [] });
        });
    } else {
      // Guest - load from localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          setCart(parsed || { items: [] });
        } catch (err) {
          console.error("Parse localStorage cart error:", err);
          setCart({ items: [] });
        }
      } else {
        setCart({ items: [] });
      }
    }
  }, [isLoggedIn]);

  // Sync localStorage cart to backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          if (parsed.items && parsed.items.length > 0) {
            // Sync to backend
            api.post("/cart/sync", { items: parsed.items })
              .then(() => {
                // Clear localStorage after sync
                localStorage.removeItem('cart');
                // Refresh cart from backend
                return api.get("/cart");
              })
              .then(res => {
                setCart(res.data || { items: [] });
              })
              .catch(err => {
                console.error("Cart sync error:", err);
              });
          }
        } catch (err) {
          console.error("Parse cart for sync error:", err);
        }
      }
    }
  }, [isLoggedIn]);

  const addToCart = async (item) => {
    if (isLoggedIn) {
      // Logged in - add to backend
      try {
        await api.post("/cart", item);
        const res = await api.get("/cart");
        setCart(res.data || { items: [] });
      } catch (err) {
        console.error("Add to cart error:", err);
        throw err;
      }
    } else {
      // Guest - add to localStorage
      try {
        const existingCart = localStorage.getItem('cart');
        let cartData = existingCart ? JSON.parse(existingCart) : { items: [] };
        
        if (!cartData.items || !Array.isArray(cartData.items)) {
          cartData = { items: [] };
        }

        const existingItemIndex = cartData.items.findIndex(
          i => i.variantId === item.variantId
        );

        if (existingItemIndex > -1) {
          cartData.items[existingItemIndex].quantity += item.quantity || 1;
        } else {
          cartData.items.push({
            ...item,
            quantity: item.quantity || 1
          });
        }

        localStorage.setItem('cart', JSON.stringify(cartData));
        setCart(cartData);
      } catch (err) {
        console.error("Add to localStorage cart error:", err);
        throw err;
      }
    }
  };

  const removeFromCart = async (productId, variantId) => {
    if (isLoggedIn) {
      // Logged in - remove from backend
      try {
        await api.delete(`/cart/${variantId}`);
        const res = await api.get("/cart");
        setCart(res.data || { items: [] });
      } catch (err) {
        console.error("Remove from cart error:", err);
        throw err;
      }
    } else {
      // Guest - remove from localStorage
      try {
        const updatedItems = cart.items.filter(item => item.variantId !== variantId);
        const updatedCart = { items: updatedItems };
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
      } catch (err) {
        console.error("Remove from localStorage cart error:", err);
        throw err;
      }
    }
  };

  const updateQuantity = async (productId, variantId, quantity) => {
    if (quantity < 1) return;

    if (isLoggedIn) {
      // Logged in - update backend
      try {
        await api.put(`/cart/${variantId}`, { quantity });
        const res = await api.get("/cart");
        setCart(res.data || { items: [] });
      } catch (err) {
        console.error("Update quantity error:", err);
        throw err;
      }
    } else {
      // Guest - update localStorage
      try {
        const updatedItems = cart.items.map(item =>
          item.variantId === variantId ? { ...item, quantity } : item
        );
        const updatedCart = { items: updatedItems };
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
      } catch (err) {
        console.error("Update localStorage cart error:", err);
        throw err;
      }
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      // Logged in - clear backend cart
      try {
        for (const item of cart.items) {
          await api.delete(`/cart/${item.variantId}`);
        }
        setCart({ items: [] });
      } catch (err) {
        console.error("Clear cart error:", err);
        throw err;
      }
    } else {
      // Guest - clear localStorage
      localStorage.removeItem('cart');
      setCart({ items: [] });
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
