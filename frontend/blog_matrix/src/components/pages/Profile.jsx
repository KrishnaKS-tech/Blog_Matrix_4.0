import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const avatars = [
  "/avatars/1.png",
  "/avatars/2.png",
  "/avatars/3.png",
  "/avatars/4.png",
  "/avatars/5.png",
  "/avatars/6.png",
  "/avatars/7.png",
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const res = await axios.get("http://localhost:5000/api/login/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setForm({
        firstname: res.data.user.firstname || "",
        lastname: res.data.user.lastname || "",
      });
      setSelectedAvatar(res.data.user.avatar || avatars[0]);
    } catch (err) {
      toast.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = () => {
    // UI-only for now
    setUser({
      ...user,
      firstname: form.firstname,
      lastname: form.lastname,
      avatar: selectedAvatar,
    });

    toast.success("Profile updated (UI only)");
    setEditMode(false);
  };

  if (loading) return <p className="text-center mt-8">Loading profile...</p>;
  if (!user) return <p className="text-center mt-8">No user data found.</p>;

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-teal-600 text-center mb-8">
          Profile
        </h2>

        {/* ===== Avatar ===== */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={selectedAvatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-teal-500 shadow-md"
          />
          <p className="mt-4 text-xl font-semibold text-gray-800">
            {user.username}
          </p>
        </div>

        {/* ===== VIEW MODE ===== */}
        {!editMode && (
          <>
            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between">
                <span className="text-gray-500">First Name</span>
                <span className="font-medium text-gray-800">
                  {user.firstname || "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Last Name</span>
                <span className="font-medium text-gray-800">
                  {user.lastname || "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-teal-500 text-white py-3 rounded-xl
                         hover:bg-teal-600 transition font-semibold"
            >
              Edit Profile
            </button>
          </>
        )}

        {/* ===== EDIT MODE ===== */}
        {editMode && (
          <>
            {/* Avatar Picker */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                Choose Avatar
              </h3>
              <div className="flex justify-center gap-4">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-16 h-16 rounded-full cursor-pointer transition
                      ${
                        selectedAvatar === avatar
                          ? "ring-4 ring-teal-500 scale-110"
                          : "opacity-70 hover:opacity-100"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="First Name"
                value={form.firstname}
                onChange={(e) =>
                  setForm({ ...form, firstname: e.target.value })
                }
                className="w-full border rounded-xl p-3 focus:outline-teal-500"
              />

              <input
                type="text"
                placeholder="Last Name"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                className="w-full border rounded-xl p-3 focus:outline-teal-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-teal-500 text-white py-3 rounded-xl hover:bg-teal-600 font-semibold"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
