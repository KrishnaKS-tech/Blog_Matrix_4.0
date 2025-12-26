// Import React and useState hook for component state
import React, { useState } from "react";

// Axios for making HTTP requests
import axios from "axios";

// Hook for programmatic navigation after login
import { useNavigate } from "react-router-dom";

// Toast notifications for success/error feedback
import { toast } from "react-hot-toast";

// Reusable floating input component
import FloatingInput from "../ui/FloatingInput";

/**
 * 🔐 LoginForm Component
 * Purpose:
 *  - Displays a login modal
 *  - Authenticates user via backend
 *  - Stores JWT token
 *  - Redirects user to dashboard on success
 */
function LoginForm({ showLogin, onClose }) {
  // React Router navigation hook
  const navigate = useNavigate();

  // Form state for username and password
  const [form, setForm] = useState({ username: "", password: "" });

  // Loading state to disable button during API call
  const [loading, setLoading] = useState(false);

  // Do not render modal if login is not visible
  if (!showLogin) return null;

  /**
   * Handle input change
   * Uses input "name" attribute to update form state dynamically
   */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * Handle form submission
   *  - Sends login request
   *  - Stores JWT token
   *  - Redirects user on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Enable loading state

    try {
      // Send login credentials to backend
      const res = await axios.post("http://localhost:5000/api/login", form);

      // Extract JWT token from response
      const { token } = res.data;

      // Store token in localStorage for authenticated requests
      localStorage.setItem("token", token);

      // Show success notification
      toast.success("Logged in successfully 👋");

      // Close login modal
      onClose();

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Show error notification on invalid credentials
      toast.error("Invalid credentials", err);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    // Modal overlay (dark background)
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm
                 flex items-center justify-center z-50"
      // Close modal when clicking outside
    >
      {/* Modal container */}
      <div
        className="bg-white p-12 rounded-3xl w-[400px]
                   shadow-2xl relative animate-pop"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click
      >
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400
                     hover:text-black text-xl"
        >
          ✕
        </button>

        {/* 🔹 Modal heading */}
        <h2
          className="text-3xl font-bold text-gray-600
                       text-center mb-12"
        >
          Welcome Back
        </h2>

        {/* 🔹 Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username input */}
          <FloatingInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          {/* Password input */}
          <FloatingInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Submit button */}
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

// Export LoginForm component
export default LoginForm;
