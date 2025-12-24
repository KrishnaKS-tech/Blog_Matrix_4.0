import React from "react";
import { EditorContent } from "@tiptap/react";

function FloatingEditor({ label, editor }) {
  return (
    <div className="relative w-full text-xl">
      {/* Floating label */}
      <span className="absolute -top-3 left-6 bg-white px-2 text-gray-500 z-10 text-xl">
        {label}
      </span>

      {/* Editor container */}
      <div
        className="border border-gray-200 rounded-2xl min-h-[250px] p-4
                   focus-within:ring-1 focus-within:ring-teal-400
                   transition cursor-text shadow-sm"
        // Focus editor when user clicks anywhere inside
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default FloatingEditor;
