import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbBook } from "react-icons/tb";

const BLOGS_PER_PAGE = 6;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [activeBlog, setActiveBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs/allblogs");
      if (!res.ok) throw new Error("Failed to fetch all blogs.");
      setBlogs(await res.json());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  if (loading)
    return <p className="text-center mt-12 text-gray-500">Loading blogs...</p>;

  /* ================= FULL BLOG VIEW ================= */
  if (activeBlog) {
    return (
      <div className="max-w-5xl mx-auto p-0">
        <button
          onClick={() => setActiveBlog(null)}
          className="mb-6 text-teal-600 font-medium hover:underline"
        >
          ← Back to All Blogs
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {activeBlog.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-8">
            <span>📅 {formatDate(activeBlog.createdAt)}</span>
            <span className="font-semibold text-teal-600">
              ✍️ {activeBlog.author?.username || "Unknown"}
            </span>
          </div>

          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: activeBlog.description,
            }}
          />

          <div className="mt-10 pt-6 border-t text-sm text-gray-400">
            Tags: {activeBlog.tags}
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
        <h2 className="text-4xl font-bold text-teal-600 mb-2">Explore Blogs</h2>
        <p className="text-gray-500">
          Read ideas, stories, and knowledge shared by the community.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">No blogs found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <TbBook size={36} className="text-teal-500" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {blog.title}
                  </h3>
                </div>
                <div
                  className="prose prose-sm max-w-none text-gray-700 line-clamp-4"
                  dangerouslySetInnerHTML={{
                    __html: blog.description,
                  }}
                />

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-teal-600 font-semibold">
                    Read more →
                  </span>

                  <span className="text-sm text-gray-400">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>

                <div className="mt-2 text-md font-medium text-gray-500 flex items-center ">
                  Posted By :{" "}
                  <p className="ml-2 text-black text-xl">
                    {blog.author?.username || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < blogs.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + BLOGS_PER_PAGE)}
                className="bg-teal-500 text-white px-12 py-3 rounded-full
                           hover:bg-teal-600 transition
                           font-semibold shadow-lg"
              >
                Load More Blogs
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
