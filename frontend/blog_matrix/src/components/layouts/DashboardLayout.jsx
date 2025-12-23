import { Outlet, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { TbSmartHome, TbUser, TbBooks, TbLogout } from "react-icons/tb";
import { LuNewspaper } from "react-icons/lu";
import { FaList } from "react-icons/fa";

export default function DashboardLayout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (window.confirm("Do you really want to logout?")) {
      onLogout();
      navigate("/", { replace: true });
      toast("You have been logged out.", { icon: "⏻" });
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-lg transition 
     ${
       isActive
         ? "bg-teal-500 text-white shadow"
         : "text-gray-700 hover:bg-teal-100"
     }`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= Fixed Sidebar ================= */}
      <aside
        className="fixed left-0 top-0 h-screen w-64
                   bg-white shadow-xl flex flex-col z-50"
      >
        <div className="p-6 text-center border-b">
          <h1 className="text-2xl font-bold text-teal-600">Blog Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard</p>
        </div>

        <nav className="flex flex-col gap-2 p-4 flex-1 ">
          <NavLink to="/dashboard" end className={linkClasses}>
            <TbSmartHome size={22} />
            Home
          </NavLink>

          <NavLink to="/dashboard/myblogs" className={linkClasses}>
            <LuNewspaper size={22} />
            My Blogs
          </NavLink>

          <NavLink to="/dashboard/allblogs" className={linkClasses}>
            <FaList size={22} />
            All Blogs
          </NavLink>

          <NavLink to="/dashboard/profile" className={linkClasses}>
            <TbUser size={22} />
            Profile
          </NavLink>
        </nav>

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

      {/* ================= Right Content ================= */}
      <div className="ml-64 min-h-screen flex flex-col">
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
