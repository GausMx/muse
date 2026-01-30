import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import api from "../utils/api.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = AuthProvider();

  const [form, setForm] = useState({
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
      const res = await api.post("/api/auth/login", form);

      login(res.data); // expects { token, user }
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl"
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-xl hover:opacity-90"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
