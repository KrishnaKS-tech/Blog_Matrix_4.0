import React, { useEffect, useState } from "react";
import { TbBooks, TbCalendar, TbUser } from "react-icons/tb";
import BlogForm from "../forms/BlogForm";
import toast from "react-hot-toast";
import writing from "../../images/writing-hand.jpg";
import axios from "axios";

export default function DashboardHome() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/blogs/myblogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyBlogs(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch your blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const totalBlogs = myBlogs.length;
  const publishedToday = myBlogs.filter(
    (b) => new Date(b.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header + Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
        {/* Header Box */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-400 text-white p-8 rounded-3xl  flex-1">
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-gray-100">
            Manage your blogs and create new content quickly.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6 mt-4 md:mt-0">
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform">
            <TbBooks size={28} className="text-teal-500 mb-2" />
            <p className="text-gray-400">Total Blogs</p>
            <p className="text-3xl font-bold text-teal-500">{totalBlogs}</p>
          </div>

          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform">
            <TbCalendar size={28} className="text-teal-500 mb-2" />
            <p className="text-gray-400">Published Today</p>
            <p className="text-3xl font-bold text-teal-500">{publishedToday}</p>
          </div>
        </div>
      </div>

      <div className="flex  gap-10">
        {/* Optional Illustration / Content Section */}
        <div className="mt-6 bg-white rounded-3xl p-8 flex flex-col items-center gap-6 flex-1 mb-6">
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

            {/* Feature highlights */}
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

            {/* Motivation / guidance */}
            <p className="text-sm text-gray-500 mb-6">
              Consistency builds credibility. Keep writing, refining, and
              sharing your ideas — your audience is waiting.
            </p>
          </div>
        </div>

        {/* Blog Form */}
        <div className="max-w-4xl mx-auto flex-2">
          <BlogForm />
        </div>
      </div>
    </div>
  );
}
