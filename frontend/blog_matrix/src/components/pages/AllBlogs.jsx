import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BLOGS_PER_PAGE = 5;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
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

  const visibleBlogs = blogs.slice(0, visibleCount);

  if (loading) return <p className="text-center mt-8">Loading blogs...</p>;

  return (
    <div className="px-4 md:px-10 py-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-teal-600">All Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">No blogs found.</p>
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {blog.title}
                  </h3>

                  {/* BLOG CONTENT */}
                  <div
                    className={`prose max-w-none text-gray-700 ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  />

                  {/* READ MORE */}
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
                  <div className="flex justify-between items-center mt-6 pt-4 border-t text-sm text-gray-500">
                    <span>Tags: {blog.tags}</span>

                    <div className="flex items-center gap-4">
                      <span>Posted on {formatDate(blog.createdAt)}</span>
                      <span className="font-medium text-teal-500">
                        {blog.author?.username || "Unknown"}
                      </span>
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
