import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function BlogForm({ onBlogAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add a blog.");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/blogs", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Blog added successfully!");
      setForm({ title: "", description: "", tags: "" });

      // Optional: callback to refresh blogs list
      if (onBlogAdded) onBlogAdded();
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="bg-white p-8 rounded-2xl w-[350px] shadow-xl relative">
        <h2 className="text-2xl font-semibold text-center text-teal-500 mb-4">
          Add Blog
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          />
          <input
            name="description"
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          />
          <input
            name="tags"
            type="text"
            placeholder="Tags"
            value={form.tags}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          />
          <button
            type="submit"
            className="bg-teal-500 text-white p-3 rounded hover:bg-teal-600"
          >
            Add Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogForm;
