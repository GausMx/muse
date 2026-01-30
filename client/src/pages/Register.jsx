import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import api from "../utils/api.js";

export default function Register() {
  const navigate = useNavigate();
  const { login } = AuthProvider();

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
      const res = await api.post("/api/auth/register", form);

      // auto-login after register
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Register failed"
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
        <h2 className="text-2xl font-bold text-center">
          Create Account
        </h2>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <input
          name="name"
          placeholder="Full name"
          className="w-full border p-3 rounded-xl"
          onChange={handleChange}
          required
        />

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
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}
