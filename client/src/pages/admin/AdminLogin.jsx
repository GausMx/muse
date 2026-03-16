import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../utils/api.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async e => {
  e.preventDefault();
  setError("");

  try {
    const res = await api.post("/auth/login", form);

    if (res.data.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    login(res.data);
    navigate("/admin/dashboard");
  } catch (err) {
    setError(err.response?.data?.message || err.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <input name="email" placeholder="Email" type="email" onChange={handleChange} className="w-full border p-3 rounded-xl" required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full border p-3 rounded-xl" required />
        <button className="w-full bg-black text-white p-3 rounded-xl hover:opacity-90">Login</button>
      </form>
    </div>
  );
}
