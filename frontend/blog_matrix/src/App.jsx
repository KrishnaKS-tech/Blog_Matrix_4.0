import "./App.css";
import Navbar from "./components/ui/Navbar";
import SignUpModal from "./components/forms/SignUpModal";
import blog from "./images/blog.jpg";
import home from "./images/home2.png";
import Hr from "./components/ui/Hr";
import WhatIsBM from "./components/blog/WhatIsBM";
import Footer from "./components/ui/Footer";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCallback } from "react";

// Toast
import { Toaster } from "react-hot-toast";

// Protected Route
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Dashboard Layout + Pages
import DashboardLayout from "./components/layouts/DashboardLayout";
import DashboardHome from "./components/pages/DashboardHome";
import MyBlogs from "./components/pages/MyBlogs";
import AllBlogs from "./components/pages/AllBlogs";
import Profile from "./components/pages/Profile";
import GlobalRouteGuard from "./components/auth/GlobalRouteGuard";

import HomeSidebar from "./components/ui/HomeSidebar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <HomeSidebar />

      {/* Main Content */}
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
              <span className="text-teal-600">Blog Matrix</span>
            </h1>

            <p className="text-lg text-gray-600 mt-6">
              A modern platform to write, publish and explore blogs from people
              around the world.
            </p>
          </div>
        </section>

        <Hr mb="10" mt="4" />

        {/* What is Blog Matrix */}
        <section className="flex flex-col md:flex-row items-center gap-10 px-10 py-12">
          <img src={home} alt="Home" className="w-full md:w-1/2 rounded-2xl" />
          <WhatIsBM />
        </section>

        <Hr mb="6" mt="6" />
        <Footer />
      </div>
    </div>
  );
}

function App() {
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      {/* 🔥 Global guard that always checks the URL */}
      <GlobalRouteGuard />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="myblogs" element={<MyBlogs />} />
          <Route path="allblogs" element={<AllBlogs />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
