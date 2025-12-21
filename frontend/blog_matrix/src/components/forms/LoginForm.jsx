import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // ✅ import toast

function LoginForm({ showLogin, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (!showLogin) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      const { token } = res.data;

      localStorage.setItem("token", token);

      toast.success("Logged in successfully! 👋"); // ✅ show toast

      onClose();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials"); // ✅ toast on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl w-[350px] shadow-xl animate-pop relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center text-teal-500 mb-4">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          />

          <button
            type="submit"
            className="bg-teal-500 text-white p-3 rounded hover:bg-teal-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
