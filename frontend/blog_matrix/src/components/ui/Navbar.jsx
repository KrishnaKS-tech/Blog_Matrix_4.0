import React, { useState } from "react";
import LoginForm from "../forms/LoginForm";
import SignUpForm from "../forms/SignUpForm";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      {/* 🔹 Navbar Header */}
      <div className="flex justify-between items-center bg-teal-500 p-5 text-white text-2xl">
        <h1 className="font-bold">Blog Matrix</h1>
        <p>
          <span
            className="hover:cursor-pointer hover:text-black duration-500"
            onClick={() => {
              setShowSignUp(true);
              setShowLogin(false);
            }}
          >
            SignUp
          </span>{" "}
          /{" "}
          <span
            className="hover:cursor-pointer hover:text-black duration-500"
            onClick={() => {
              setShowLogin(true);
              setShowSignUp(false);
            }}
          >
            Login
          </span>
        </p>
      </div>

      {/* 🔹 Modals */}
      <LoginForm showLogin={showLogin} onClose={() => setShowLogin(false)} />
      <SignUpForm
        showSignUp={showSignUp}
        onClose={() => setShowSignUp(false)}
      />
    </>
  );
}

export default Navbar;
