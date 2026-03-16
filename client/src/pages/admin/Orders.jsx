import { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
        Loading orders...
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: "#322D29",
      minHeight: "100vh",
      color: "#EFE9E1",
      padding: "clamp(30px, 5vw, 60px)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=Jost:wght@200;300;400;500;600&display=swap');

        :root {
          --charcoal: #322D29;
          --burgundy: #72383D;
          --taupe: #AC9C8D;
          --sand: #D1C7BD;
          --cream: #EFE9E1;
        }

        .orders-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 40px;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
        }

        .orders-table th {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          text-align: left;
          padding: 16px;
          border-bottom: 1px solid rgba(172,156,141,0.2);
        }

        .orders-table td {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: var(--sand);
          padding: 16px;
          border-bottom: 1px solid rgba(172,156,141,0.1);
        }

        .orders-table tbody tr:hover {
          background: rgba(172,156,141,0.05);
        }

        .status-badge {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 10px;
          border: 1px solid;
          display: inline-block;
        }

        .status-pending {
          color: #AC9C8D;
          border-color: rgba(172,156,141,0.4);
          background: rgba(172,156,141,0.1);
        }

        .status-shipped {
          color: #8BA888;
          border-color: rgba(139,168,136,0.4);
          background: rgba(139,168,136,0.1);
        }

        .status-delivered {
          color: #6B9B6E;
          border-color: rgba(107,155,110,0.4);
          background: rgba(107,155,110,0.1);
        }

        .status-btn {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: transparent;
          border: 1px solid rgba(172,156,141,0.3);
          color: var(--taupe);
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-right: 8px;
        }

        .status-btn:hover {
          border-color: var(--burgundy);
          background: rgba(114,56,61,0.1);
          color: var(--cream);
        }
      `}</style>

      <h1 className="orders-title">Orders</h1>

      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--taupe)' }}>
                  {order._id.slice(-8)}
                </td>
                <td style={{ fontWeight: 500, color: 'var(--cream)' }}>
                  {order.user?.name || 'Guest'}
                </td>
                <td>
                  {order.items?.map(i => i.product?.name || 'Product').join(", ").substring(0, 40)}
                  {order.items?.length > 1 && '...'}
                </td>
                <td>₦{order.total?.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ fontSize: 11, color: 'rgba(172,156,141,0.6)' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {order.status !== "Shipped" && order.status !== "Delivered" && (
                      <button
                        className="status-btn"
                        onClick={() => updateStatus(order._id, "Shipped")}
                      >
                        Ship
                      </button>
                    )}
                    {order.status === "Shipped" && (
                      <button
                        className="status-btn"
                        onClick={() => updateStatus(order._id, "Delivered")}
                      >
                        Deliver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{
          background: 'rgba(50,45,41,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(172,156,141,0.15)',
          padding: 80,
          textAlign: 'center',
          fontFamily: "'Jost', sans-serif",
          fontSize: 12,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'rgba(172,156,141,0.4)',
        }}>
          No orders yet
        </div>
      )}
    </div>
  );
}