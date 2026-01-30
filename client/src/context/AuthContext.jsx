import { useCart } from "./CartContext.jsx"; // import cart context

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const { cart, clearCart, setCart } = useCart(); // access local cart

  const login = async (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    // Sync localStorage cart to backend
    if (cart.length > 0) {
      try {
        await Promise.all(
          cart.map(item =>
            api.post("/cart", {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            })
          )
        );
        clearCart(); // clear local cart after syncing
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
