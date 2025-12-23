import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

/* 🔹 Floating Input Component */
function FloatingInput({ label, name, type = "text", value, onChange }) {
  return (
    <div className="relative w-full">
      <span
        className="absolute -top-3 left-4 bg-white px-2
                   text-md text-gray-500 z-10"
      >
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl
                   px-4 py-3 focus:outline-none
                   focus:border-teal-500 transition"
        required
      />
    </div>
  );
}

function LoginForm({ showLogin, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (!showLogin) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      const { token } = res.data;

      localStorage.setItem("token", token);
      toast.success("Logged in successfully 👋");

      onClose();
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid credentials", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm
                 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-12 rounded-3xl w-[400px]
                   shadow-2xl relative animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400
                     hover:text-black text-xl"
        >
          ✕
        </button>

        {/* 🔹 Heading */}
        <h2
          className="text-3xl font-bold text-gray-600
                       text-center mb-12"
        >
          Welcome Back
        </h2>

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FloatingInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <FloatingInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 text-white py-3 rounded-xl
                       text-lg font-semibold
                       hover:bg-teal-600 transition
                       disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
