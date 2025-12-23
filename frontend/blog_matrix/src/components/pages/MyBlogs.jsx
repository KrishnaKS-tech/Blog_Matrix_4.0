import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { TbBook } from "react-icons/tb";

const BLOGS_PER_PAGE = 6;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [activeBlog, setActiveBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/blogs/myblogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch blogs");
      setBlogs(await res.json());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      setActiveBlog(null);
      toast.success("Blog deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading your blogs...</p>
    );

  /* ================= FULL BLOG VIEW ================= */
  if (activeBlog) {
    return (
      <div className="max-w-5xl mx-auto p-0">
        <button
          onClick={() => setActiveBlog(null)}
          className="mb-6 text-teal-600 font-medium hover:underline"
        >
          ← Back to My Blogs
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TbBook size={28} className="text-teal-500" />
            {activeBlog.title}
          </h1>

          <div className="text-sm text-gray-400 mb-6">
            Posted on {formatDate(activeBlog.createdAt)}
          </div>

          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: activeBlog.description }}
          />

          <div className="mt-10 flex justify-between items-center border-t pt-4">
            <span className="text-sm text-gray-400">
              Tags: {activeBlog.tags}
            </span>
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
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-teal-600 mb-2">Your Blogs</h2>
        <p className="text-gray-500">
          All your published thoughts, stories, and ideas live here.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven’t written any blogs yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.slice(0, visibleCount).map((blog) => (
              <div
                key={blog._id}
                onClick={() => setActiveBlog(blog)}
                className="cursor-pointer bg-white rounded-3xl border border-gray-200 p-6 transition hover:shadow-2xl hover:-translate-y-1 transform duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <TbBook size={30} className="text-teal-500" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {blog.title}
                  </h3>
                </div>

                <div
                  className="prose prose-sm max-w-none text-gray-700 line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />

                <p className="mt-3 text-teal-600 font-medium hover:underline">
                  Read full blog →
                </p>

                <div className="mt-4 text-sm text-gray-400 flex justify-between">
                  <span>{formatDate(blog.createdAt)}</span>
                  <span className="font-medium text-teal-500">You</span>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < blogs.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + BLOGS_PER_PAGE)}
                className="bg-teal-500 text-white px-10 py-3 rounded-xl hover:bg-teal-600 transition font-semibold shadow-lg"
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
