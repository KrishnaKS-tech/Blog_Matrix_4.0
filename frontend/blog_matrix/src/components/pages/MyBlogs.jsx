import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const BLOGS_PER_PAGE = 5;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
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

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Blog deleted successfully!");
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch {
      toast.error("Failed to delete blog. Try again.");
    }
  };

  const visibleBlogs = blogs.slice(0, visibleCount);

  if (loading) return <p className="text-center mt-8">Loading your blogs...</p>;

  return (
    <div className="px-4 md:px-10 py-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-teal-600">My Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven’t written any blogs yet.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {visibleBlogs.map((blog) => {
              const isExpanded = expandedBlogId === blog._id;

              return (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl border border-gray-100
                             shadow-sm hover:shadow-md transition p-6"
                >
                  {/* TITLE */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {blog.title}
                  </h3>

                  {/* BLOG CONTENT */}
                  <div
                    className={`prose prose-sm max-w-none text-gray-700 ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  />

                  {/* READ MORE / LESS */}
                  {blog.description.length > 300 && (
                    <button
                      onClick={() =>
                        setExpandedBlogId(isExpanded ? null : blog._id)
                      }
                      className="mt-2 text-teal-600 font-medium hover:underline"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}

                  {/* FOOTER */}
                  <div className="flex justify-between items-center pt-4 mt-4 border-t">
                    <span className="text-sm text-gray-400">
                      Tags: {blog.tags}
                    </span>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        Posted on {formatDate(blog.createdAt)}
                      </span>

                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg
                                   hover:bg-red-100 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VIEW MORE */}
          {visibleCount < blogs.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + BLOGS_PER_PAGE)}
                className="bg-teal-500 text-white px-10 py-3 rounded-xl
                           hover:bg-teal-600 transition font-semibold"
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
