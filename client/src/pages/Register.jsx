import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api.js";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: "#322D29",
      minHeight: "100vh",
      color: "#EFE9E1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --charcoal: #322D29;
          --burgundy: #72383D;
          --taupe:    #AC9C8D;
          --sand:     #D1C7BD;
          --cream:    #EFE9E1;
        }

        .auth-bg-circle {
          position: absolute;
          border: 1px solid rgba(114,56,61,0.08);
          border-radius: 50%;
          pointer-events: none;
        }

        .auth-form-card {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(172,156,141,0.15);
          width: 100%;
          max-width: 440px;
          padding: clamp(40px, 6vw, 56px);
          position: relative;
          z-index: 2;
          animation: slideUp 0.8s ease forwards;
        }

        .auth-kicker {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--taupe);
          text-align: center;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .auth-kicker::before,
        .auth-kicker::after {
          content: '';
          width: 24px;
          height: 1px;
          background: var(--taupe);
        }

        .auth-title {
          font-size: clamp(32px, 5vw, 44px);
          font-weight: 300;
          letter-spacing: -0.5px;
          color: var(--cream);
          text-align: center;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: var(--sand);
          text-align: center;
          margin-bottom: 36px;
          letter-spacing: 1px;
        }

        .auth-error {
          background: rgba(114,56,61,0.25);
          border: 1px solid rgba(114,56,61,0.5);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          padding: 12px 16px;
          margin-bottom: 20px;
          text-align: center;
          letter-spacing: 0.5px;
        }

        .auth-input-group {
          margin-bottom: 20px;
        }

        .auth-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          display: block;
          margin-bottom: 8px;
        }

        .auth-input {
          width: 100%;
          background: rgba(239,233,225,0.05);
          border: 1px solid rgba(172,156,141,0.2);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          padding: 14px 18px;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .auth-input::placeholder {
          color: rgba(172,156,141,0.4);
        }

        .auth-input:focus {
          border-color: var(--burgundy);
          background: rgba(239,233,225,0.08);
        }

        .auth-btn {
          width: 100%;
          background: var(--burgundy);
          border: 1px solid var(--burgundy);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .auth-btn:hover:not(:disabled) {
          background: transparent;
          border-color: var(--taupe);
          transform: translateY(-2px);
        }

        .auth-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .auth-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(172,156,141,0.2), transparent);
          margin: 32px 0;
        }

        .auth-footer {
          text-align: center;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: var(--sand);
          letter-spacing: 0.5px;
        }

        .auth-footer a {
          color: var(--taupe);
          text-decoration: none;
          border-bottom: 1px solid rgba(172,156,141,0.3);
          padding-bottom: 1px;
          transition: color 0.3s ease, border-color 0.3s ease;
        }

        .auth-footer a:hover {
          color: var(--cream);
          border-color: var(--cream);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background decorative circles */}
      <div className="auth-bg-circle" style={{ top: '-10%', left: '-5%', width: '500px', height: '500px' }} />
      <div className="auth-bg-circle" style={{ bottom: '-15%', right: '-8%', width: '600px', height: '600px' }} />
      <div className="auth-bg-circle" style={{ top: '20%', right: '10%', width: '280px', height: '280px', opacity: 0.5 }} />

      {/* Form Card */}
      <div className="auth-form-card">
        <div className="auth-kicker">Join Muse</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start your journey with us</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              className="auth-input"
              onChange={handleChange}
              value={form.name}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              className="auth-input"
              onChange={handleChange}
              value={form.email}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              className="auth-input"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-divider" />

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}