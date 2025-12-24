import React from "react";

function FloatingInput({ label, value, name, onChange, type = "text" }) {
  return (
    <div className="relative w-full">
      {/* Floating label */}
      <span className="absolute -top-3 left-6 bg-white px-2 text-gray-500 z-10 text-xl rounded-md">
        {label}
      </span>

      {/* Input field */}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-5 py-4 text-xl
                   focus:outline-none focus:border-teal-500 transition"
        required
      />
    </div>
  );
}

export default FloatingInput;
