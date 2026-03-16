import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    paymentMethod: "card", // card, bank_transfer, ussd
  });

  // Paystack public key - replace with your actual key
  const PAYSTACK_PUBLIC_KEY = "pk_test_2cce2a2c77009c307194ecf9d3d7c4be00deabba";

  // Load Paystack inline script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch cart
    api.get("/cart")
      .then(res => {
        const backendCart = res.data;
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
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch cart error:", err);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 500;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state) {
      alert("Please fill in all shipping details");
      return;
    }

    if (cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Check if PaystackPop is loaded
    if (!window.PaystackPop) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    setProcessing(true);

    try {
      // Initialize Paystack Popup with inline functions
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: total * 100, // Paystack uses kobo (multiply by 100)
        currency: 'NGN',
        ref: `ORDER-${Date.now()}`,
        channels: form.paymentMethod === 'card' 
          ? ['card'] 
          : form.paymentMethod === 'bank_transfer'
          ? ['bank']
          : ['ussd'],
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: form.name
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: form.phone
            }
          ]
        },
        onClose: function() {
          setProcessing(false);
        },
        callback: function(response) {
          // Don't use async here - Paystack doesn't support it
          // Handle the order creation in a promise
          const orderData = {
            items: cart.items.map(item => ({
              product: item.productId,
              variantId: item.variantId === item.productId ? null : item.variantId, // null if no real variant
              quantity: item.quantity,
              price: item.price
            })),
            total,
            shippingAddress: {
              name: form.name,
              phone: form.phone,
              address: form.address,
              city: form.city,
              state: form.state,
            },
            paymentMethod: form.paymentMethod,
            paymentReference: response.reference,
            paymentStatus: "paid"
          };

          // Create order
          api.post("/orders", orderData)
            .then(() => {
              // Clear cart - use variantId or productId as fallback
              const deletePromises = cart.items.map(item => 
                api.delete(`/cart/${item.variantId || item.productId}`)
              );
              return Promise.all(deletePromises);
            })
            .then(() => {
              alert("Order placed successfully!");
              navigate("/orders");
            })
            .catch(err => {
              console.error("Order creation error:", err);
              alert("Payment successful but order creation failed. Please contact support with reference: " + response.reference);
            })
            .finally(() => {
              setProcessing(false);
            });
        }
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack error:", err);
      alert("Failed to initialize payment. Please try again.");
      setProcessing(false);
    }
  };

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
        Loading...
      </div>
    );
  }

  if (cart.items.length === 0) {
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
        <h2 style={{ fontSize: 32, fontWeight: 300, marginBottom: 12 }}>Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          style={{
            background: "#72383D",
            border: "1px solid #72383D",
            color: "#EFE9E1",
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            padding: "16px 36px",
            cursor: "pointer",
            marginTop: 20,
          }}
        >
          Continue Shopping
        </button>
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

        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(40px,6vw,80px) clamp(24px,6vw,60px);
        }

        .checkout-title {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 40px;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 40px;
        }

        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr; }
        }

        .form-card {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          display: block;
          margin-bottom: 8px;
        }

        .form-input, .form-select {
          width: 100%;
          background: rgba(239,233,225,0.05);
          border: 1px solid rgba(172,156,141,0.2);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--burgundy);
        }

        .payment-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .payment-options { grid-template-columns: 1fr; }
        }

        .payment-option {
          background: transparent;
          border: 1px solid rgba(172,156,141,0.2);
          color: var(--sand);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .payment-option:hover {
          border-color: var(--taupe);
        }

        .payment-option.active {
          background: var(--burgundy);
          border-color: var(--burgundy);
          color: var(--cream);
        }

        .order-summary {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 32px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .summary-item {
          display: flex;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(172,156,141,0.1);
        }

        .summary-item-img {
          width: 60px;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
        }

        .summary-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .summary-item-info {
          flex: 1;
        }

        .summary-item-name {
          font-size: 14px;
          color: var(--cream);
          margin-bottom: 4px;
        }

        .summary-item-variant {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          color: var(--taupe);
          letter-spacing: 1px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: var(--sand);
          margin: 16px 0;
        }

        .summary-row.total {
          font-size: 18px;
          color: var(--cream);
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid rgba(172,156,141,0.2);
        }

        .submit-btn {
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

        .submit-btn:hover:not(:disabled) {
          background: transparent;
          border-color: var(--taupe);
        }

        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <form onSubmit={handleSubmit} className="checkout-grid">
          {/* Shipping & Payment Form */}
          <div>
            <div className="form-card" style={{ marginBottom: 24 }}>
              <h2 className="section-title">Shipping Information</h2>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0801 234 5678"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-card">
              <h2 className="section-title">Payment Method</h2>

              <div className="payment-options">
                <button
                  type="button"
                  className={`payment-option ${form.paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: 'card' })}
                >
                  Card
                </button>
                <button
                  type="button"
                  className={`payment-option ${form.paymentMethod === 'bank_transfer' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: 'bank_transfer' })}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  className={`payment-option ${form.paymentMethod === 'ussd' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, paymentMethod: 'ussd' })}
                >
                  USSD
                </button>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="section-title">Order Summary</h2>

            {cart.items.map(item => (
              <div key={item.variantId} className="summary-item">
                <div className="summary-item-img">
                  <img 
                    src={item.image ? `http://localhost:5000${item.image}` : "https://placehold.co/60x80/322D29/AC9C8D?text=MUSE"}
                    alt={item.name}
                    onError={e => e.target.src = "https://placehold.co/60x80/322D29/AC9C8D?text=MUSE"}
                  />
                </div>
                <div className="summary-item-info">
                  <div className="summary-item-name">{item.name}</div>
                  {(item.size || item.color) && (
                    <div className="summary-item-variant">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " • "}
                      {item.color && `Color: ${item.color}`}
                    </div>
                  )}
                  <div style={{ 
                    fontFamily: "'Jost', sans-serif", 
                    fontSize: 11, 
                    color: 'var(--taupe)', 
                    marginTop: 4 
                  }}>
                    Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ 
                  fontFamily: "'Jost', sans-serif", 
                  fontSize: 13, 
                  color: 'var(--cream)' 
                }}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}

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
          </div>
        </form>
      </div>
    </div>
  );
}