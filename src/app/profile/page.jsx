"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // প্রোফাইল ফর্ম স্টেট
  const [profileForm, setProfileForm] = useState({
    bio: "",
    skills: "",
    hourly_rate: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে কারেন্ট লগইনড ইউজার ডাটা রিড করা
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // ফর্ম ফিল্ডে ওল্ড ডাটা প্রি-পিপুলেট করা
      setProfileForm({
        bio: parsedUser.bio || "",
        skills: Array.isArray(parsedUser.skills) ? parsedUser.skills.join(", ") : "",
        hourly_rate: parsedUser.hourly_rate || ""
      });
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: "", text: "" });

    try {
     const response = await fetch("http://localhost:5000/api/users/profile", {
  method: "PATCH", // <-- মেথডটি হুবহু "PATCH" করে দাও
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(profileForm),
  credentials: "include", 
});

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile.");

      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // 🎯 লোকাল স্টোরেজ সিঙ্ক করা (যেন রিফ্রেশ করলেও ডাটা হারিয়ে না যায়)
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white"><div className="animate-pulse text-emerald-400">Loading profile data...</div></div>;
  if (!user) return <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center"><p className="text-amber-400 bg-amber-500/10 p-4 rounded-xl">Please sign in first to view your profile management dashboard.</p></div>;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* বাম পাশ: কারেন্ট প্রোফাইল কার্ড */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl h-fit space-y-6 text-center">
          <div className="space-y-3">
            <img 
              src={user.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt={user.name} 
              className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/20 mx-auto"
              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
            />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 capitalize">
              {user.role}
            </span>
          </div>

          <div className="h-px bg-white/10" />

          {/* কারেন্ট লাইভ মেটাডাটা ডিসপ্লে */}
          <div className="text-left space-y-3 text-sm">
            {user.role === "freelancer" && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Hourly Rate</p>
                <p className="font-semibold text-emerald-400 text-lg">${user.hourly_rate || 0}/hr</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase">Core Biography</p>
              <p className="text-gray-300 text-xs leading-relaxed italic">{user.bio || "No biography setup yet."}</p>
            </div>
          </div>
        </div>

        {/* ডান পাশ: এডিট প্রোফাইল ফর্ম */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Profile Settings</h2>
            <p className="text-gray-400 text-sm mt-1">Update your professional details to attract direct business contracts.</p>
          </div>

          {message.text && (
            <p className={`text-sm p-3 rounded-xl border ${message.type === "success" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
              {message.text}
            </p>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {user.role === "freelancer" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Hourly Rate ($)</label>
                  <input 
                    type="number" 
                    name="hourly_rate" 
                    value={profileForm.hourly_rate} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition text-sm" 
                    placeholder="e.g., 35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Professional Skills (Comma Separated)</label>
                  <input 
                    type="text" 
                    name="skills" 
                    value={profileForm.skills} 
                    onChange={handleInputChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition text-sm" 
                    placeholder="React, Next.js, Node.js, MongoDB"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Separate individual tech stack tokens using commas.</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Professional Biography</label>
              <textarea 
                name="bio" 
                rows="5" 
                value={profileForm.bio} 
                onChange={handleInputChange} 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition resize-none text-sm leading-relaxed" 
                placeholder="Describe your domain experience, tech stack expertise, and business delivery records..."
              />
            </div>

            <Button type="submit" isLoading={updateLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-xl transition shadow-lg">
              Save Profile Changes
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}