import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs/allblogs");
      if (!res.ok) throw new Error("Failed to fetch all blogs.");

      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading blogs...</p>;

  return (
    <div className="px-4 md:px-10 py-6">
      <h2 className="text-3xl font-bold mb-6 text-teal-600">All Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-700 mb-4">{blog.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Tags: {blog.tags}</span>
                <span className="font-medium text-teal-500">
                  {blog.author?.username || "Unknown"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
