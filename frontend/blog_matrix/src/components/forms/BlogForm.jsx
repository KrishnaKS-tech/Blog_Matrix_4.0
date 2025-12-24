// React hook for managing component state
import { useState } from "react";

// TipTap editor components and hooks
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

// HTTP client for API requests
import axios from "axios";

// Toast notifications for success/error messages
import toast from "react-hot-toast";

// Icon for image button
import { FaImages } from "react-icons/fa";

import FloatingInput from "../ui/FloatingInput";

import FloatingEditor from "../ui/FloatingEditor";

/* 🔹 Floating Input Component
   Reusable input with a floating label
*/

/* 🔹 Floating Editor Component
   Wrapper for TipTap editor with floating label
*/

/* 🔹 Main Blog Form Component */
export default function BlogForm() {
  // State for blog title
  const [title, setTitle] = useState("");

  // State for tags
  const [tags, setTags] = useState("");

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit, // Basic formatting (bold, italic, lists, etc.)
      Image, // Image support
    ],
    content: "", // Initial editor content
  });

  /* 🔹 Add Image to Editor */
  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  /* 🔹 Handle Blog Submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if editor is empty
    if (!editor || editor.isEmpty) {
      toast.error("Blog description cannot be empty");
      return;
    }

    try {
      // Get JWT token from local storage
      const token = localStorage.getItem("token");

      // Send blog data to backend
      await axios.post(
        "http://localhost:5000/api/blogs",
        {
          title,
          description: editor.getHTML(), // Editor content as HTML
          tags: tags.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Success feedback
      toast.success("Blog published successfully!");

      // Reset form
      setTitle("");
      setTags("");
      editor.commands.clearContent();
    } catch {
      // Error feedback
      toast.error("Failed to publish blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-0 py-6">
      <div className="bg-white rounded-3xl p-8">
        {/* Form Heading */}
        <h2 className="text-3xl font-bold text-teal-600 text-center mb-8">
          Create Blog
        </h2>

        {/* Blog Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* Blog Title */}
          <FloatingInput
            label="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Editor Toolbar */}
          <div className="flex gap-2 border border-gray-200 rounded-lg p-2 bg-white">
            {/* Bold */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className="px-3 py-1 rounded hover:bg-gray-200 font-bold"
            >
              B
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className="px-3 py-1 rounded hover:bg-gray-200 italic"
            >
              I
            </button>

            {/* Image Insert */}
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-2"
            >
              <FaImages />
              Image
            </button>
          </div>

          {/* Blog Content Editor */}
          <FloatingEditor label="Blog Content" editor={editor} />

          {/* Tags Input */}
          <FloatingInput
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Submit Button */}
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
