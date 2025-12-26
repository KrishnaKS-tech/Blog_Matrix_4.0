// Import React and required hooks
import React, { useEffect, useState } from "react";

// Icons for statistics cards
import { TbBooks, TbCalendar } from "react-icons/tb";

// Blog creation form component
import BlogForm from "../forms/BlogForm";

// Toast notifications for errors
import toast from "react-hot-toast";

// Illustration image
import writing from "../../images/writing-hand.jpg";

// Axios for API requests
import axios from "axios";

/**
 * 📊 DashboardHome Component
 * Purpose:
 *  - Shows dashboard overview
 *  - Displays blog statistics
 *  - Fetches user's blogs
 *  - Renders blog creation form
 */
export default function DashboardHome() {
  // State to store logged-in user's blogs
  const [myBlogs, setMyBlogs] = useState([]);

  // Loading state while fetching data
  const [loading, setLoading] = useState(true);

  /**
   * 🔹 Fetch blogs created by the logged-in user
   */
  const fetchMyBlogs = async () => {
    try {
      // Get JWT token stored after login
      const token = localStorage.getItem("token");

      // Call protected API route
      const res = await axios.get("http://localhost:5000/api/blogs/myblogs", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });

      // Store blogs in state
      setMyBlogs(res.data);
    } catch (err) {
      // Show error message if request fails
      toast.error(err.response?.data?.message || "Failed to fetch your blogs");
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  // Fetch blogs once component mounts
  useEffect(() => {
    fetchMyBlogs();
  }, []);

  // Total blogs count
  const totalBlogs = myBlogs.length;

  // Count blogs published today
  const publishedToday = myBlogs.filter(
    (b) => new Date(b.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* ================= HEADER + STATS ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-400 text-white p-8 rounded-3xl flex-1">
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-gray-100">
            Manage your blogs and create new content quickly.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="flex gap-6 mt-4 md:mt-0">
          {/* Total Blogs Card */}
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform">
            <TbBooks size={28} className="text-teal-500 mb-2" />
            <p className="text-gray-400">Total Blogs</p>
            <p className="text-3xl font-bold text-teal-500">{totalBlogs}</p>
          </div>

          {/* Published Today Card */}
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform">
            <TbCalendar size={28} className="text-teal-500 mb-2" />
            <p className="text-gray-400">Published Today</p>
            <p className="text-3xl font-bold text-teal-500">{publishedToday}</p>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex gap-10 ">
        {/* Illustration + Motivation Section */}
        <div className="mt-6 bg-white rounded-3xl p-8 flex flex-col items-center gap-6 flex-1 mb-6 shadow-xl">
          <img
            src={writing}
            alt="Writing illustration"
            className="w-full md:w-5/5 rounded-xl"
          />

          <div className="text-center max-w-xl">
            <h2 className="text-2xl font-bold text-teal-600 mb-2">
              Ready to write your next blog?
            </h2>

            <p className="text-gray-600 mb-6">
              Start creating meaningful content using our powerful editor. Write
              freely, format effortlessly, and publish when you’re ready.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                ✍️ Rich text editor with formatting tools
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                🖼️ Add images to enhance your story
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                📊 Track your published and draft blogs
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                🚀 Publish instantly or save for later
              </div>
            </div>

            {/* Motivation Text */}
            <p className="text-sm text-gray-500 mb-6">
              Consistency builds credibility. Keep writing, refining, and
              sharing your ideas — your audience is waiting.
            </p>
          </div>
        </div>

        {/* Blog Creation Form */}
        <div className="max-w-4xl mx-auto flex-2">
          <BlogForm />
        </div>
      </div>
    </div>
  );
}
