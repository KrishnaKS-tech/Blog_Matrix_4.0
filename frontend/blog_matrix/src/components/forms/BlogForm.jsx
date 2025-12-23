import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import axios from "axios";
import toast from "react-hot-toast";

export default function BlogForm() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Start writing your blog here...",
      }),
    ],
    content: "",
  });

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
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
        {
          title,
          description: editor.getHTML(),
          tags: tags.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
    <div className="max-w-4xl mx-auto px-4 py-1">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-teal-600 text-center mb-8">
          Create Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
            className="w-full text-2xl font-semibold border-b
                       focus:outline-none focus:border-teal-500 py-3"
            required
          />

          {/* TOOLBAR */}
          <div className="flex gap-2 border rounded-lg p-2 bg-gray-50">
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
              className="px-3 py-1 rounded hover:bg-gray-200"
            >
              🖼 Image
            </button>
          </div>

          {/* EDITOR (FIXED) */}
          <div
            className="border rounded-xl min-h-[220px] p-3
                       focus-within:border-teal-400 transition cursor-text"
            onClick={() => editor?.chain().focus().run()}
          >
            <EditorContent editor={editor} />
          </div>

          {/* TAGS */}
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full border rounded-xl p-3
                       focus:outline-none focus:border-teal-500"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-xl
                       hover:bg-teal-600 transition font-semibold text-lg"
          >
            Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
}
