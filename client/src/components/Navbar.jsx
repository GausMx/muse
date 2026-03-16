import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  // Safely access admin context - it may not be available outside admin routes
  let admin = null;
  let adminLogout = null;
  
  try {
    const adminAuth = useAdminAuth();
    admin = adminAuth.admin;
    adminLogout = adminAuth.logout;
  } catch (e) {
    // AdminAuthProvider not available - this is fine for non-admin pages
  }

  const handleLogout = () => {
    if (isAdmin && adminLogout) {
      adminLogout();
    } else {
      logout();
    }
    setMobileOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(50, 45, 41, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(172, 156, 141, 0.15)',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=Jost:wght@300;400;500&display=swap');

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 60px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .nav-logo {
          font-size: 24px;
          font-weight: 300;
          letter-spacing: 8px;
          text-transform: uppercase;
          color: #EFE9E1;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .nav-logo:hover {
          color: #AC9C8D;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #D1C7BD;
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #EFE9E1;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 1px;
          background: #72383D;
        }

        .nav-btn {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: transparent;
          color: #AC9C8D;
          border: 1px solid rgba(172, 156, 141, 0.3);
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          border-color: #AC9C8D;
          color: #EFE9E1;
        }

        .nav-btn-primary {
          background: #72383D;
          border-color: #72383D;
          color: #EFE9E1;
        }

        .nav-btn-primary:hover {
          background: transparent;
          border-color: #AC9C8D;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger span {
          width: 24px;
          height: 2px;
          background: #AC9C8D;
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(7px, 7px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: rgba(50, 45, 41, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(172, 156, 141, 0.15);
          padding: 24px clamp(24px, 6vw, 60px);
          flex-direction: column;
          gap: 20px;
          max-height: calc(100vh - 80px);
          overflow-y: auto;
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-menu .nav-link {
          padding: 12px 0;
          border-bottom: 1px solid rgba(172, 156, 141, 0.1);
        }

        .mobile-menu .nav-btn {
          width: 100%;
          text-align: center;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
        }

        .admin-badge {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 2px;
          background: rgba(114, 56, 61, 0.3);
          border: 1px solid rgba(114, 56, 61, 0.5);
          color: #AC9C8D;
          padding: 4px 10px;
          margin-right: 16px;
        }
      `}</style>

      <div className="nav-container">
        <Link to={isAdmin ? "/admin/dashboard" : "/"} className="nav-logo">
          Muse
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          {isAdmin ? (
            <>
              <span className="admin-badge">Admin Panel</span>
              <Link to="/admin/dashboard" className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/admin/products" className={`nav-link ${location.pathname === '/admin/products' ? 'active' : ''}`}>
                Products
              </Link>
              <Link to="/admin/categories" className={`nav-link ${location.pathname === '/admin/categories' ? 'active' : ''}`}>
                Categories
              </Link>
              <Link to="/admin/orders" className={`nav-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
                Orders
              </Link>
              <button onClick={handleLogout} className="nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
                Shop
              </Link>
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
              {!user ? (
                <>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                  <Link to="/register" className="nav-btn nav-btn-primary">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <span className="nav-link" style={{ color: '#AC9C8D', cursor: 'default' }}>
                    {user.name}
                  </span>
                  <button onClick={handleLogout} className="nav-btn">
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className={`hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {isAdmin ? (
          <>
            <Link 
              to="/admin/dashboard" 
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/products" 
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/admin/categories" 
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/admin/orders" 
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Orders
            </Link>
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/products" 
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/cart" 
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Cart
            </Link>
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="nav-btn nav-btn-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="nav-link" style={{ color: '#AC9C8D' }}>
                  Hello, {user.name}
                </span>
                <button onClick={handleLogout} className="nav-btn">
                  Logout
                </button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}