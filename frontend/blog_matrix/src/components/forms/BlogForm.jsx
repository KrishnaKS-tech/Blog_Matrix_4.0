import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import axios from "axios";
import toast from "react-hot-toast";
import { FaImages } from "react-icons/fa";

/* 🔹 Floating Input Component */
function FloatingInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="relative w-full">
      <span className="absolute -top-3 left-6 bg-white px-2  text-gray-500 z-10 text-xl ">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-5 py-4 text-xl
                   focus:outline-none focus:border-teal-500 transition "
        required
      />
    </div>
  );
}
/* 🔹 Floating Editor Component */
function FloatingEditor({ label, editor }) {
  return (
    <div className="relative w-full text-xl">
      <span className="absolute -top-3 left-6 bg-white px-2 text-gray-500 z-10 text-xl">
        {label}
      </span>
      <div
        className="border border-gray-200 rounded-2xl min-h-[250px] p-4 focus-within:ring-1
                   focus-within:ring-teal-400 transition cursor-text shadow-sm"
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default function BlogForm() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
  });

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor || editor.isEmpty) {
      toast.error("Blog description cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/blogs",
        { title, description: editor.getHTML(), tags: tags.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Blog published successfully!");
      setTitle("");
      setTags("");
      editor.commands.clearContent();
    } catch {
      toast.error("Failed to publish blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl  p-8">
        <h2 className="text-3xl font-bold text-teal-600 text-center mb-8">
          Create Blog
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* Title */}
          <FloatingInput
            label="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Toolbar */}
          <div className="flex gap-2 border border-gray-200 rounded-lg p-2 bg-white ">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className="px-3 py-1 rounded hover:bg-gray-200 font-bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className="px-3 py-1 rounded hover:bg-gray-200 italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-2"
            >
              <FaImages />
              Image
            </button>
          </div>

          {/* Editor */}
          {/* Editor with Floating Label */}
          <FloatingEditor label="Blog Content" editor={editor} />

          {/* Tags */}
          <FloatingInput
            label="Tags "
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-2xl
                       hover:bg-teal-600 transition font-semibold text-lg"
          >
            Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
}
