// React hooks for state management and lifecycle
import { useEffect, useState } from "react";

// Toast notifications for user feedback
import toast from "react-hot-toast";

// Axios for making HTTP requests
import axios from "axios";

// Blog icon
import { TbBook } from "react-icons/tb";

// Number of blogs to show per page
const BLOGS_PER_PAGE = 6;

// Utility function to format date nicely
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * 📝 MyBlogs Component
 * Purpose:
 *  - Fetch and display blogs created by the logged-in user
 *  - Allow viewing full blog details
 *  - Allow deletion of user's own blogs
 */
export default function MyBlogs() {
  // Store user's blogs
  const [blogs, setBlogs] = useState([]);

  // Number of visible blogs in grid view
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);

  // Store currently selected blog for full view
  const [activeBlog, setActiveBlog] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  /**
   * 🔹 Fetch blogs created by logged-in user
   */
  const fetchMyBlogs = async () => {
    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // API request with Authorization header
      const res = await axios.get("http://localhost:5000/api/blogs/myblogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Save blogs to state
      setBlogs(res.data);
    } catch (err) {
      // Show error message
      toast.error(err.response?.data?.message || "Failed to fetch blogs");
    } finally {
      // Stop loading indicator
      setLoading(false);
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchMyBlogs();
  }, []);

  /**
   * 🗑️ Delete a blog
   * Only allowed for the blog owner
   */
  const handleDelete = async (blogId) => {
    // Ask for confirmation
    if (!window.confirm("Delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");

      // Delete request with auth header
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted blog from state
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));

      // Close full blog view
      setActiveBlog(null);

      // Success message
      toast.success("Blog deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // Show loading text while fetching
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading your blogs...</p>
    );

  /* ================= FULL BLOG VIEW ================= */
  if (activeBlog) {
    return (
      <div className="max-w-5xl mx-auto p-0">
        {/* Back button */}
        <button
          onClick={() => setActiveBlog(null)}
          className="mb-6 text-teal-600 font-medium hover:underline"
        >
          ← Back to My Blogs
        </button>

        {/* Blog content */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TbBook size={28} className="text-teal-500" />
            {activeBlog.title}
          </h1>

          {/* Blog date */}
          <div className="text-sm text-gray-400 mb-6">
            Posted on {formatDate(activeBlog.createdAt)}
          </div>

          {/* Blog description rendered as HTML */}
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: activeBlog.description }}
          />

          {/* Footer actions */}
          <div className="mt-10 flex justify-between items-center border-t pt-4">
            <span className="text-sm text-gray-400">
              Tags: {activeBlog.tags}
            </span>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(activeBlog._id)}
              className="text-red-600 hover:underline font-medium"
            >
              Delete Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= GRID VIEW ================= */
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-teal-600 mb-2">Your Blogs</h2>
        <p className="text-gray-500">
          All your published thoughts, stories, and ideas live here.
        </p>
      </div>

      {/* No blogs case */}
      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven’t written any blogs yet.
        </p>
      ) : (
        <>
          {/* Blogs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.slice(0, visibleCount).map((blog) => (
              <div
                key={blog._id}
                onClick={() => setActiveBlog(blog)}
                className="cursor-pointer bg-white rounded-3xl
                           border border-gray-100 p-8
                           shadow-md hover:shadow-2xl
                           transition-all duration-300
                           hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <TbBook size={30} className="text-teal-500" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {blog.title}
                  </h3>
                </div>

                {/* Preview of blog content */}
                <div
                  className="prose prose-sm max-w-none text-gray-700 line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />

                <p className="mt-3 text-teal-600 font-medium hover:underline">
                  Read full blog →
                </p>

                {/* Footer info */}
                <div className="mt-4 text-sm text-gray-400 flex justify-between">
                  <span>{formatDate(blog.createdAt)}</span>
                  <span className="font-medium text-teal-500">You</span>
                </div>
              </div>
            ))}
          </div>

          {/* Load more button */}
          {visibleCount < blogs.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + BLOGS_PER_PAGE)}
                className="bg-teal-500 text-white px-10 py-3 rounded-xl
                           hover:bg-teal-600 transition font-semibold shadow-lg"
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
