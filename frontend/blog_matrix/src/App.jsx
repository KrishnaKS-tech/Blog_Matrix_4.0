// Global styles
import "./App.css";

// UI Components
import Hr from "./components/ui/Hr";
import WhatIsBM from "./components/blog/WhatIsBM";
import Footer from "./components/ui/Footer";
import HomeSidebar from "./components/ui/HomeSidebar";

// Images
import blog from "./images/blog.jpg";
import home from "./images/home2.png";

// React Router for navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";

// React hook
import { useCallback } from "react";

// Toast notifications
import { Toaster } from "react-hot-toast";

// Route protection (frontend auth guard)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GlobalRouteGuard from "./components/auth/GlobalRouteGuard";

// Dashboard layout and pages
import DashboardLayout from "./components/layouts/DashboardLayout";
import DashboardHome from "./components/pages/DashboardHome";
import MyBlogs from "./components/pages/MyBlogs";
import AllBlogs from "./components/pages/AllBlogs";
import Profile from "./components/pages/Profile";

/**
 * 🏠 Home Component
 * Public landing page (NO authentication required)
 */
function Home() {
  return (
    <div className="min-h-screen bg-teal-50 mb-0">
      {/* Sidebar visible on home page */}
      <HomeSidebar />

      {/* Main content area */}
      <div className="ml-64">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-10 px-10 py-16">
          <img
            src={blog}
            alt="Blog illustration"
            className="w-full md:w-1/2 rounded-2xl shadow-lg"
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 leading-snug">
              Express your ideas with{" "}
              <p className="text-teal-600 text-5xl">Blog Matrix</p>
            </h1>

            <p className="text-lg text-gray-600 mt-6">
              A modern platform to write, publish and explore blogs from people
              around the world.
            </p>
          </div>
        </section>

        {/* Divider */}
        <Hr mb="10" mt="4" />

        {/* About Section */}
        <section className="flex flex-col md:flex-row items-center gap-10 px-10 py-12">
          <img src={home} alt="Home" className="w-full md:w-1/2 rounded-2xl" />
          <WhatIsBM />
        </section>

        {/* Footer */}
        <Hr mb="6" mt="6" />
        <Footer />
      </div>
    </div>
  );
}

/**
 * 🚀 App Component
 * Root component of the application
 * Handles routing and global guards
 */
function App() {
  /**
   * Logout handler
   * Clears JWT token from localStorage
   */
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
  }, []);

  return (
    <BrowserRouter>
      {/* Toast container for notifications */}
      <Toaster position="top-center" />

      {/* 🔥 GlobalRouteGuard
         - Runs on every route change
         - Can be used for token expiry checks, redirects, etc.
      */}
      <GlobalRouteGuard />

      {/* Application routes */}
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            // ProtectedRoute checks if JWT exists
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Nested dashboard routes */}
          <Route index element={<DashboardHome />} />
          <Route path="myblogs" element={<MyBlogs />} />
          <Route path="allblogs" element={<AllBlogs />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Export App as default
export default App;
