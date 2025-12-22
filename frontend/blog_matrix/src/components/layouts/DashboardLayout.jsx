import { Outlet, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../ui/Footer";
import Hr from "../ui/Hr";

export default function DashboardLayout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (window.confirm("Do you really want to logout?")) {
      onLogout();
      navigate("/", { replace: true });
      toast("You have been logged out.", { icon: "⏻" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-teal-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Matrix</h1>

        <nav className="flex gap-6 items-center">
          <Link
            to="/dashboard"
            className="hover:cursor-pointer hover:text-black duration-500 text-2xl"
          >
            Home
          </Link>
          <span className="text-2xl">/</span>
          <Link
            to="/dashboard/myblogs"
            className="hover:cursor-pointer hover:text-black duration-500 text-2xl"
          >
            My Blogs
          </Link>
          <span className="text-2xl">/</span>
          <Link
            to="/dashboard/profile"
            className="hover:cursor-pointer hover:text-black duration-500 text-2xl"
          >
            Profile
          </Link>
          <span className="text-2xl">/</span>
          <Link
            to="/dashboard/allblogs"
            className="hover:cursor-pointer hover:text-black duration-500 text-2xl"
          >
            All Blogs
          </Link>
          <span className="text-2xl">/</span>
          <button
            onClick={handleLogoutClick}
            className="hover:cursor-pointer hover:text-black duration-500 text-2xl "
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="grow bg-white p-6">
        <Outlet />
      </main>
      <Hr />
      <Footer />
    </div>
  );
}
