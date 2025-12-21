import React, { useRef } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const toastShownRef = useRef(false); // ref persists across renders

  if (!token && !toastShownRef.current) {
    toast.error("You must be logged in to access the Dashboard!");
    toastShownRef.current = true; // mark as shown
  }

  if (!token) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
