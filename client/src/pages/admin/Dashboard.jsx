import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/admin/products"),
          api.get("/orders")
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;

        // Calculate total revenue
        const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Get recent orders (last 5)
        const recent = orders.slice(0, 5);

        // Find low stock products
        const lowStock = products.filter(p => {
          if (p.variants?.length > 0) {
            return p.variants.some(v => v.stock < 10);
          }
          return (p.stock || 0) < 10;
        }).slice(0, 5);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: revenue,
          recentOrders: recent,
          lowStockProducts: lowStock
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        Loading dashboard...
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

        .dash-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 8px;
        }

        .dash-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(172,156,141,0.5);
          margin-bottom: 48px;
          letter-spacing: 1px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr; }
        }

        .stat-card {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 32px;
          transition: border-color 0.3s ease;
        }

        .stat-card:hover {
          border-color: rgba(172,156,141,0.3);
        }

        .stat-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 48px;
          font-weight: 300;
          color: var(--cream);
          line-height: 1;
        }

        .stat-value.revenue::before {
          content: '₦';
          font-size: 32px;
          margin-right: 4px;
          color: var(--burgundy);
        }

        .section-title {
          font-size: 24px;
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 20px;
        }

        .section-title em {
          font-style: italic;
          color: var(--taupe);
        }

        .table-card {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 24px;
          margin-bottom: 32px;
        }

        .dash-table {
          width: 100%;
          border-collapse: collapse;
        }

        .dash-table th {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(172,156,141,0.2);
        }

        .dash-table td {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: var(--sand);
          padding: 16px;
          border-bottom: 1px solid rgba(172,156,141,0.1);
        }

        .dash-table tbody tr:hover {
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

        .stock-warning {
          color: var(--burgundy);
          font-size: 11px;
        }

        .view-all-link {
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

        .view-all-link:hover {
          color: var(--cream);
          border-color: var(--cream);
        }
      `}</style>

      <h1 className="dash-title">Dashboard</h1>
      <p className="dash-subtitle">Overview of your store</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{stats.totalProducts}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value revenue">{stats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <h2 className="section-title">Recent <em>Orders</em></h2>
      <div className="table-card">
        {stats.recentOrders.length > 0 ? (
          <>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--taupe)' }}>
                      {order._id.slice(-8)}
                    </td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>₦{order.total?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'rgba(172,156,141,0.6)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/admin/orders" className="view-all-link">View All Orders →</Link>
          </>
        ) : (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(172,156,141,0.4)', textAlign: 'center', padding: 40 }}>
            No orders yet
          </p>
        )}
      </div>

      {/* Low Stock Alert */}
      <h2 className="section-title">Low <em>Stock Alert</em></h2>
      <div className="table-card">
        {stats.lowStockProducts.length > 0 ? (
          <>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map(product => {
                  const lowestStock = product.variants?.length > 0
                    ? Math.min(...product.variants.map(v => v.stock))
                    : product.stock || 0;

                  return (
                    <tr key={product._id}>
                      <td style={{ fontWeight: 500, color: 'var(--cream)' }}>{product.name}</td>
                      <td>{product.category?.name || 'N/A'}</td>
                      <td>
                        <span className="stock-warning">{lowestStock} left</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Link to="/admin/products" className="view-all-link">Manage Products →</Link>
          </>
        ) : (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(172,156,141,0.4)', textAlign: 'center', padding: 40 }}>
            All products have sufficient stock
          </p>
        )}
      </div>
    </div>
  );
}