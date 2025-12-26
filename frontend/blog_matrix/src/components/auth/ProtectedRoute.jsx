// Import React and useRef hook
import React, { useRef } from "react";

// Used to redirect users programmatically
import { Navigate } from "react-router-dom";

// Toast library for showing notifications
import toast from "react-hot-toast";

/**
 * 🔐 ProtectedRoute Component
 * Purpose:
 *  - Protects frontend routes (like /dashboard)
 *  - Checks if a JWT token exists in localStorage
 *  - Redirects unauthenticated users to home page
 *  - Shows a toast message only once
 */
function ProtectedRoute({ children }) {
  // Get JWT token stored after login
  const token = localStorage.getItem("token");

  // useRef is used to prevent showing the toast multiple times
  // This value persists across re-renders without causing re-renders
  const toastShownRef = useRef(false);

  // If user is NOT logged in and toast has not been shown yet
  if (!token && !toastShownRef.current) {
    // Show error notification
    toast.error("You must be logged in to access the Dashboard!");

    // Mark toast as shown so it doesn't repeat
    toastShownRef.current = true;
  }

  // If no token exists, redirect user to home page
  if (!token) return <Navigate to="/" replace />;

  // If token exists, allow access to protected content
  return children;
}

// Export component to wrap protected routes
export default ProtectedRoute;
