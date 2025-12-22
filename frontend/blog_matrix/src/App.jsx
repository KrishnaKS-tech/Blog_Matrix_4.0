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

function Home() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <img src={blog} alt="blog" width={"47%"} />
        <SignUpModal />
      </div>
      <Hr mb={"10"} mt={"4"} />
      <div className="flex">
        <img src={home} alt="" className="ml-45" />
        <WhatIsBM />
      </div>
      <Hr mb={"4"} mt={"4"} />
      <Footer />
    </>
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
