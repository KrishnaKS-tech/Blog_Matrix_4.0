import React from "react";
import BlogForm from "../forms/BlogForm";

function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Welcome to your Dashboard!</h2>
      <BlogForm />
    </div>
  );
}

export default DashboardHome;
