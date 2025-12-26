// React Router utilities
// Outlet → renders child routes
// NavLink → navigation links with active state
// useNavigate → programmatic navigation
import { Outlet, NavLink, useNavigate } from "react-router-dom";

// Toast notifications
import toast from "react-hot-toast";

// Icons used in sidebar
import { TbSmartHome, TbUser, TbBooks, TbLogout } from "react-icons/tb";
import { LuNewspaper } from "react-icons/lu";
import { FaList } from "react-icons/fa";

/**
 * 📊 DashboardLayout Component
 * Purpose:
 *  - Provides a fixed sidebar layout for dashboard pages
 *  - Handles navigation between dashboard sections
 *  - Manages logout functionality
 *  - Renders nested dashboard pages using <Outlet />
 */
export default function DashboardLayout({ onLogout }) {
  // Hook for navigation
  const navigate = useNavigate();

  /**
   * 🔓 Handle Logout
   *  - Confirms logout from user
   *  - Clears authentication (handled by parent via onLogout)
   *  - Redirects to home page
   *  - Shows toast notification
   */
  const handleLogoutClick = () => {
    if (window.confirm("Do you really want to logout?")) {
      onLogout(); // Remove token (from App.jsx)
      navigate("/", { replace: true }); // Redirect to home
      toast("You have been logged out.", { icon: "⏻" });
    }
  };

  /**
   * 🎨 Dynamic NavLink Styling
   *  - Applies active styles when route matches
   */
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-lg transition 
     ${
       isActive
         ? "bg-teal-500 text-white shadow" // Active link style
         : "text-gray-700 hover:bg-teal-100" // Inactive link style
     }`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= Fixed Sidebar ================= */}
      <aside
        className="fixed left-0 top-0 h-screen w-64
                   bg-white shadow-xl flex flex-col z-50 rounded-r-4xl"
      >
        {/* Logo / Header */}
        <div className="p-6 text-center border-b">
          <h1 className="text-2xl font-bold text-teal-600">Blog Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-4 flex-1">
          {/* Dashboard Home */}
          <NavLink to="/dashboard" end className={linkClasses}>
            <TbSmartHome size={22} />
            Home
          </NavLink>

          {/* My Blogs */}
          <NavLink to="/dashboard/myblogs" className={linkClasses}>
            <LuNewspaper size={22} />
            My Blogs
          </NavLink>

          {/* All Blogs */}
          <NavLink to="/dashboard/allblogs" className={linkClasses}>
            <FaList size={22} />
            All Blogs
          </NavLink>

          {/* User Profile */}
          <NavLink to="/dashboard/profile" className={linkClasses}>
            <TbUser size={22} />
            Profile
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                       text-lg text-red-600 hover:bg-red-100 transition"
          >
            <TbLogout size={22} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= Main Content Area ================= */}
      <div className="ml-64 min-h-screen flex flex-col">
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-teal-50 rounded-l-4xl ">
          {/* Render child dashboard routes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
