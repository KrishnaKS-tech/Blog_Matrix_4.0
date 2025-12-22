import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const res = await fetch("http://localhost:5000/api/blogs/myblogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch your blogs.");

      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  // DELETE BLOG
  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Blog deleted successfully!");
      fetchMyBlogs(); // Refresh the list
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete blog. Try again."
      );
    }
  };

  if (loading) return <p className="text-center mt-8">Loading your blogs...</p>;

  return (
    <div className="px-4 md:px-10 py-6">
      <h2 className="text-3xl font-bold mb-6 text-teal-600">My Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven’t written any blogs yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 relative"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-700 mb-4">{blog.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Tags: {blog.tags}</span>
                <span className="font-medium text-teal-500">You</span>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(blog._id)}
                className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
