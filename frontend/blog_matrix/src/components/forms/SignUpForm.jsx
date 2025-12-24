import { useState } from "react";
import axios from "axios";
import FloatingInput from "../ui/FloatingInput";

/* 🔹 Floating Input Component */

export default function SignUpForm({ showSignUp, onClose }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (!showSignUp) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/signupdata",
        form
      );
      alert(res.data.message);
      setForm({ firstname: "", lastname: "", username: "", password: "" });
      onClose();
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
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
        className="bg-white p-12 rounded-3xl w-[600px]
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
          className="text-4xl font-bold text-gray-600
                       text-center mb-16"
        >
          Create Account
        </h2>

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* First + Last Name */}
          <div className="flex gap-4 ">
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

          {/* 🔹 Submit */}
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
