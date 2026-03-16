import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";

export default function Cart() {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // Fetch cart - from backend if logged in, from localStorage if guest
  const fetchCart = async () => {
    if (user) {
      // Logged in - fetch from backend
      try {
        const res = await api.get("/cart");
        const backendCart = res.data;

        // Transform backend cart to match our display format
        const items = backendCart.items?.map(item => {
          const variant = item.product?.variants?.find(v => v._id === item.variantId);
          return {
            productId: item.product._id,
            variantId: item.variantId,
            quantity: item.quantity,
            name: item.product.name,
            image: item.product.images?.[0],
            price: variant?.price || item.product.basePrice,
            size: variant?.size,
            color: variant?.color,
            product: item.product
          };
        }) || [];

        setCart({ items });
      } catch (err) {
        console.error("Fetch cart error:", err);
        setCart({ items: [] });
      }
    } else {
      // Guest - fetch from localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (err) {
          console.error("Parse localStorage cart error:", err);
          setCart({ items: [] });
        }
      } else {
        setCart({ items: [] });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Save to localStorage (for guest users)
  const saveToLocalStorage = (cartData) => {
    localStorage.setItem('cart', JSON.stringify(cartData));
    setCart(cartData);
  };

  const updateQuantity = async (variantId, newQuantity) => {
    if (newQuantity < 1) return;

    if (user) {
      // Logged in - update backend
      try {
        await api.put(`/cart/${variantId}`, { quantity: newQuantity });
        fetchCart();
      } catch (err) {
        console.error("Update quantity error:", err);
        alert("Failed to update quantity");
      }
    } else {
      // Guest - update localStorage
      const updatedItems = cart.items.map(item =>
        item.variantId === variantId ? { ...item, quantity: newQuantity } : item
      );
      saveToLocalStorage({ items: updatedItems });
    }
  };

  const removeItem = async (variantId) => {
    if (user) {
      // Logged in - remove from backend
      try {
        await api.delete(`/cart/${variantId}`);
        fetchCart();
      } catch (err) {
        console.error("Remove item error:", err);
        alert("Failed to remove item");
      }
    } else {
      // Guest - remove from localStorage
      const updatedItems = cart.items.filter(item => item.variantId !== variantId);
      saveToLocalStorage({ items: updatedItems });
    }
  };

  const clearCart = async () => {
    if (!confirm("Clear entire cart?")) return;

    if (user) {
      // Logged in - clear backend cart
      try {
        for (const item of cart.items) {
          await api.delete(`/cart/${item.variantId}`);
        }
        fetchCart();
      } catch (err) {
        console.error("Clear cart error:", err);
        alert("Failed to clear cart");
      }
    } else {
      // Guest - clear localStorage
      saveToLocalStorage({ items: [] });
    }
  };

  // Calculate totals
  const cartItems = cart.items || [];
  
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = cartItems.length > 0 ? 500 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div style={{
        fontFamily: "'Jost', sans-serif",
        background: "#322D29",
        minHeight: "100vh",
        color: "#EFE9E1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        letterSpacing: 3,
        textTransform: "uppercase",
      }}>
        Loading cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        background: "#322D29",
        minHeight: "100vh",
        color: "#EFE9E1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "40px 24px",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=Jost:wght@300;400;500&display=swap');
        `}</style>
        
        <div style={{
          textAlign: "center",
          maxWidth: 500,
        }}>
          <p style={{
            fontSize: 48,
            marginBottom: 20,
            color: "rgba(172,156,141,0.2)",
          }}>✦</p>
          <h2 style={{
            fontSize: 32,
            fontWeight: 300,
            marginBottom: 12,
            color: "#EFE9E1",
          }}>Your Cart is Empty</h2>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            color: "rgba(172,156,141,0.6)",
            marginBottom: 32,
            letterSpacing: "1px",
          }}>Start adding beautiful pieces to your collection</p>
          <Link to="/products" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#72383D",
            border: "1px solid #72383D",
            color: "#EFE9E1",
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            padding: "16px 36px",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}>
            Explore Collection
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: "#322D29",
      minHeight: "100vh",
      color: "#EFE9E1",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=Jost:wght@300;400;500;600&display=swap');

        :root {
          --charcoal: #322D29;
          --burgundy: #72383D;
          --taupe: #AC9C8D;
          --sand: #D1C7BD;
          --cream: #EFE9E1;
        }

        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(40px,6vw,80px) clamp(24px,6vw,60px);
        }

        .cart-title {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 40px;
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
        }

        .cart-items {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 24px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(172,156,141,0.1);
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item-img {
          width: 100px;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
        }

        .cart-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cart-item-name {
          font-size: 18px;
          font-weight: 400;
          color: var(--cream);
          margin-bottom: 8px;
        }

        .cart-item-variant {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          color: var(--taupe);
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .cart-item-qty {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .qty-btn {
          background: transparent;
          border: 1px solid rgba(172,156,141,0.3);
          color: var(--taupe);
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .qty-btn:hover {
          border-color: var(--burgundy);
          color: var(--cream);
        }

        .qty-value {
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          color: var(--cream);
          min-width: 30px;
          text-align: center;
        }

        .cart-item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }

        .cart-item-price {
          font-size: 20px;
          font-weight: 300;
          color: var(--cream);
        }

        .remove-btn {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: transparent;
          border: 1px solid rgba(114,56,61,0.3);
          color: rgba(114,56,61,0.7);
          padding: 6px 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          border-color: var(--burgundy);
          background: rgba(114,56,61,0.1);
          color: var(--cream);
        }

        .cart-summary {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 32px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .summary-title {
          font-size: 24px;
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: var(--sand);
          margin-bottom: 16px;
        }

        .summary-row.total {
          font-size: 18px;
          color: var(--cream);
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid rgba(172,156,141,0.2);
        }

        .checkout-btn {
          width: 100%;
          background: var(--burgundy);
          border: 1px solid var(--burgundy);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 24px;
        }

        .checkout-btn:hover {
          background: transparent;
          border-color: var(--taupe);
        }

        .continue-shopping {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--taupe);
          text-decoration: none;
          border-bottom: 1px solid rgba(172,156,141,0.3);
          padding-bottom: 2px;
          transition: all 0.3s ease;
          display: inline-block;
          margin-top: 16px;
        }

        .continue-shopping:hover {
          color: var(--cream);
          border-color: var(--cream);
        }

        .clear-cart-btn {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: transparent;
          border: 1px solid rgba(114,56,61,0.3);
          color: rgba(114,56,61,0.7);
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 24px;
        }

        .clear-cart-btn:hover {
          border-color: var(--burgundy);
          background: rgba(114,56,61,0.1);
          color: var(--cream);
        }
      `}</style>

      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>

        <div className="cart-grid">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.variantId || `${item.productId}-${item.size}-${item.color}`} className="cart-item">
                <div className="cart-item-img">
                  <img 
                    src={item.image ? `http://localhost:5000${item.image}` : "https://placehold.co/100x133/322D29/AC9C8D?text=MUSE"}
                    alt={item.name || "Product"}
                    onError={e => e.target.src = "https://placehold.co/100x133/322D29/AC9C8D?text=MUSE"}
                  />
                </div>

                <div className="cart-item-info">
                  <div>
                    <h3 className="cart-item-name">{item.name || "Product"}</h3>
                    {(item.size || item.color) && (
                      <p className="cart-item-variant">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " • "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                  </div>
                  <div className="cart-item-qty">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <p className="cart-item-price">₦{(item.price * item.quantity).toLocaleString()}</p>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button 
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>₦{shipping.toLocaleString()}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => {
                if (!user) {
                  if (confirm("You need to log in to checkout. Go to login page?")) {
                    window.location.href = "/login";
                  }
                } else {
                  // TODO: Navigate to checkout
                  window.location.href = "/checkout";
                }
              }}
            >
              {user ? "Proceed to Checkout" : "Log In to Checkout"}
            </button>

            <Link to="/products" className="continue-shopping">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}