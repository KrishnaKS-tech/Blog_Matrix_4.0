import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const res = await axios.get("http://localhost:5000/api/login/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading profile...</p>;
  if (!user) return <p className="text-center mt-8">No user data found.</p>;

  return (
    <div className="flex justify-center px-4 md:px-10 py-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 hover:shadow-2xl transition duration-300">
        <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">
          Profile
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Username:</span>
            <span className="text-gray-800 font-semibold">{user.username}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">First Name:</span>
            <span className="text-gray-800 font-semibold">
              {user.firstname}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Last Name:</span>
            <span className="text-gray-800 font-semibold">{user.lastname}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Joined:</span>
            <span className="text-gray-800 font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Optional: Add total blogs */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Total Blogs:</span>
            <span className="text-gray-800 font-semibold">
              {user.totalBlogs || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
