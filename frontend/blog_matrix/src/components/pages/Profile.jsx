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
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    avatar: avatars[0],
    cover: "",
    bio: "",
    email: "",
    website: "",
    linkedin: "",
    twitter: "",
    github: "",
  });

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data.user;
      setUser(userData);

      setForm({
        name: `${userData.firstname || ""} ${userData.lastname || ""}`.trim(),
        avatar: userData.avatar || avatars[0],
        cover: userData.cover || "",
        bio: userData.bio || "",
        email: userData.email || "",
        website: userData.website || "",
        linkedin: userData.linkedin || "",
        twitter: userData.twitter || "",
        github: userData.github || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const [firstname, ...rest] = form.name.trim().split(" ");
      const lastname = rest.join(" ");

      const res = await axios.put(
        "http://localhost:5000/api/profile",
        {
          firstname,
          lastname,
          avatar: form.avatar,
          cover: form.cover,
          bio: form.bio,
          email: form.email,
          website: form.website,
          linkedin: form.linkedin,
          twitter: form.twitter,
          github: form.github,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading profile...</p>
    );
  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">No user data found.</p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* ===== SINGLE CONTAINER WITH COVER & PROFILE ===== */}
      <div className="bg-white shadow-xl rounded-3xl relative overflow-hidden">
        {/* Cover Image */}
        <div className="h-64 w-full bg-gray-200 relative">
          {form.cover ? (
            <img
              src={form.cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Cover Image
            </div>
          )}
        </div>

        {/* Profile Section BELOW Cover */}
        <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative -mt-16">
          {/* Avatar */}
          <img
            src={form.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md transition-transform hover:scale-105 z-10"
          />

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-2 z-10">
            <h2 className="text-3xl font-bold text-gray-800 mt-10">
              {user.username}
            </h2>
            {form.bio && <p className="text-gray-600 italic">{form.bio}</p>}

            {/* Social & Contact */}
            <div className="flex gap-3 justify-center md:justify-start mt-1">
              {form.email && (
                <a
                  href={`mailto:${form.email}`}
                  className="text-gray-600 hover:text-teal-500"
                  title={form.email}
                >
                  📧
                </a>
              )}
              {form.website && (
                <a
                  href={form.website}
                  target="_blank"
                  className="text-gray-600 hover:text-teal-500"
                  title="Website"
                >
                  🌐
                </a>
              )}
              {form.linkedin && (
                <a
                  href={form.linkedin}
                  target="_blank"
                  className="text-gray-600 hover:text-teal-500"
                  title="LinkedIn"
                >
                  in
                </a>
              )}
              {form.twitter && (
                <a
                  href={form.twitter}
                  target="_blank"
                  className="text-gray-600 hover:text-teal-500"
                  title="Twitter"
                >
                  🐦
                </a>
              )}
              {form.github && (
                <a
                  href={form.github}
                  target="_blank"
                  className="text-gray-600 hover:text-teal-500"
                  title="GitHub"
                >
                  🐱
                </a>
              )}
            </div>

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-teal-500 text-white py-2 px-6 rounded-xl hover:bg-teal-600 transition font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== EDIT MODE ===== */}
      {editMode && (
        <div className="bg-white shadow-xl rounded-3xl p-8 space-y-6">
          {/* Cover Image Input */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Cover Image URL
            </label>
            <input
              type="text"
              placeholder="Cover Image URL"
              value={form.cover}
              onChange={(e) => setForm({ ...form, cover: e.target.value })}
              className="w-full border rounded-xl p-3 focus:outline-teal-500"
            />
          </div>

          {/* Avatar Picker */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600 mb-4">
              Choose Avatar
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {avatars.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt="avatar"
                  onClick={() => setForm({ ...form, avatar })}
                  className={`w-16 h-16 rounded-full cursor-pointer transition-transform ${
                    form.avatar === avatar
                      ? "ring-4 ring-teal-500 scale-110"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-xl p-3 focus:outline-teal-500"
          />

          {/* Bio Input */}
          <textarea
            placeholder="Short Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full border rounded-xl p-3 focus:outline-teal-500 resize-none"
            rows={3}
          />

          {/* Social / Contact Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-xl p-3 focus:outline-teal-500"
            />
            <input
              type="text"
              placeholder="Website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full border rounded-xl p-3 focus:outline-teal-500"
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              className="w-full border rounded-xl p-3 focus:outline-teal-500"
            />
            <input
              type="text"
              placeholder="Twitter URL"
              value={form.twitter}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
              className="w-full border rounded-xl p-3 focus:outline-teal-500"
            />
            <input
              type="text"
              placeholder="GitHub URL"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              className="w-full border rounded-xl p-3 focus:outline-teal-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-600 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
