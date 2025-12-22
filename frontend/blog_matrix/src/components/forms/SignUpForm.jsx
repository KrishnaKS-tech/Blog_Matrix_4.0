import { useState } from "react";
import axios from "axios";

function SignUpForm({ showSignUp, onClose }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Hide when not triggered
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
      onClose(); // ✅ close popup after successful signup
    } catch (error) {
      if (error.response && error.response.status === 400) {
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl w-[600px] shadow-xl animate-pop relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-3xl text-teal-500 mb-8 font-semibold text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              name="firstname"
              type="text"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md w-full"
              required
            />
            <input
              name="lastname"
              type="text"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md w-full"
              required
            />
          </div>

          <input
            name="username"
            type="text"
            placeholder="Create Username"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 text-white p-3 rounded-md text-lg hover:bg-teal-600 disabled:opacity-50 transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
