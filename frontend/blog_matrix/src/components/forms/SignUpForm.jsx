// React hook for managing component state
import { useState } from "react";

// Axios for making HTTP requests to backend
import axios from "axios";

// Reusable input component with floating label
import FloatingInput from "../ui/FloatingInput";

/**
 * 🔐 SignUpForm Component
 * Purpose:
 *  - Displays a signup modal
 *  - Collects user registration data
 *  - Sends data to backend to create a new user
 */
export default function SignUpForm({ showSignUp, onClose }) {
  // Form state for user registration details
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });

  // Loading state to disable button during API request
  const [loading, setLoading] = useState(false);

  // If signup modal is not visible, render nothing
  if (!showSignUp) return null;

  /**
   * Handle input change
   * Updates form state dynamically using input name
   */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * Handle signup form submission
   *  - Sends form data to backend
   *  - Shows success or error messages
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Enable loading state

    try {
      // Send signup data to backend API
      const res = await axios.post(
        "http://localhost:5000/api/signupdata",
        form
      );

      // Show success message from backend
      alert(res.data.message);

      // Reset form fields after successful signup
      setForm({ firstname: "", lastname: "", username: "", password: "" });

      // Close signup modal
      onClose();
    } catch (error) {
      // Handle known validation errors (e.g., user already exists)
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        // Handle unexpected server errors
        alert("Something went wrong. Please try again.");
      }
    } finally {
      // Disable loading state
      setLoading(false);
    }
  };

  return (
    // Modal overlay with blur background
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm
                 flex items-center justify-center z-50"
    >
      {/* Modal container */}
      <div
        className="bg-white p-12 rounded-3xl w-[600px]
                   shadow-2xl relative animate-pop"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
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
          className="text-4xl font-bold text-gray-600
                       text-center mb-16"
        >
          Create Account
        </h2>

        {/* 🔹 Signup form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* First & Last Name fields */}
          <div className="flex gap-4">
            <FloatingInput
              label="First Name"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
            />

            <FloatingInput
              label="Last Name"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
            />
          </div>

          {/* Username field */}
          <FloatingInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          {/* Password field */}
          <FloatingInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {/* 🔹 Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 text-white py-3 rounded-xl
                       text-lg font-semibold
                       hover:bg-teal-600 transition
                       disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
