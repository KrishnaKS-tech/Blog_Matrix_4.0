import { useState } from "react";
import LoginForm from "../forms/LoginForm";
import SignUpForm from "../forms/SignUpForm";
import bmlogo from "../../images/bmlogo2.jpg";

export default function HomeSidebar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      {/* ===== Fixed Sidebar ===== */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 flex flex-col ">
        <img src={bmlogo} alt="Logo" className="w-50 h-50 mx-auto mt-4" />
        <div className="p-6 border-b border-gray-300 pt-0 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-teal-600 ">Blog Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">
            Share thoughts. Inspire minds.
          </p>
        </div>

        <div className="flex flex-col gap-3 p-6 flex-1">
          <button
            onClick={() => {
              setShowSignUp(true);
              setShowLogin(false);
            }}
            className="w-full bg-teal-500 text-white py-3 rounded-xl
                       hover:bg-teal-600 transition font-semibold"
          >
            Create Account
          </button>

          <button
            onClick={() => {
              setShowLogin(true);
              setShowSignUp(false);
            }}
            className="w-full border border-teal-500 text-teal-600 py-3 rounded-xl
                       hover:bg-teal-50 transition font-semibold"
          >
            Login
          </button>
        </div>

        <div className="p-4 text-xs text-gray-400 text-center border-t border-gray-300">
          © 2025 Blog Matrix
        </div>
      </aside>

      {/* ===== Modals ===== */}
      <LoginForm showLogin={showLogin} onClose={() => setShowLogin(false)} />
      <SignUpForm
        showSignUp={showSignUp}
        onClose={() => setShowSignUp(false)}
      />
    </>
  );
}
