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

// Custom reusable floating input component
import FloatingInput from "../ui/FloatingInput";

// Custom reusable floating editor wrapper
import FloatingEditor from "../ui/FloatingEditor";

/* ============================================================
   📝 BlogForm Component
   Purpose:
   - Allows authenticated users to create a blog
   - Uses TipTap editor for rich text content
   - Sends blog data to backend with JWT authentication
   ============================================================ */

export default function BlogForm() {
  // State for blog title input
  const [title, setTitle] = useState("");

  // State for tags input
  const [tags, setTags] = useState("");

  // Initialize TipTap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit, // Provides basic text formatting (bold, italic, lists, etc.)
      Image, // Enables image insertion support
    ],
    content: "", // Initial editor content
  });

  /* ============================================================
     🖼️ Add Image to Editor
     - Prompts user for image URL
     - Inserts image into the editor
     ============================================================ */
  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  /* ============================================================
     📤 Handle Blog Submission
     - Validates editor content
     - Sends blog data to backend
     - Uses JWT token for authentication
     ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Prevent submission if editor is empty
    if (!editor || editor.isEmpty) {
      toast.error("Blog description cannot be empty");
      return;
    }

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // Send POST request to backend API
      await axios.post(
        "http://localhost:5000/api/blogs",
        {
          title, // Blog title
          description: editor.getHTML(), // Blog content as HTML
          tags: tags.trim(), // Trim whitespace from tags
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT token
          },
        }
      );

      // Show success message
      toast.success("Blog published successfully!");

      // Reset form fields after successful submission
      setTitle("");
      setTags("");
      editor.commands.clearContent();
    } catch {
      // Show error message if request fails
      toast.error("Failed to publish blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-0 py-6 ">
      <div className="bg-white rounded-3xl p-8 shadow-xl">
        {/* 🔹 Form Heading */}
        <h2 className="text-3xl font-bold text-teal-600 text-center mb-8">
          Create Blog
        </h2>

        {/* 🔹 Blog Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* Blog Title Input */}
          <FloatingInput
            label="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Editor Toolbar */}
          <div className="flex gap-2 border border-gray-200 rounded-lg p-2 bg-white">
            {/* Bold Button */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className="px-3 py-1 rounded hover:bg-gray-200 font-bold"
            >
              B
            </button>

            {/* Italic Button */}
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className="px-3 py-1 rounded hover:bg-gray-200 italic"
            >
              I
            </button>

            {/* Insert Image Button */}
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
