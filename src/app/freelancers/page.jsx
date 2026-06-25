"use client";

import { useEffect, useState } from "react";

export default function BrowseFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 🎯 ১. চ্যালেঞ্জ ৩: পেজিনেশন, সার্চ ও ক্যাটাগরি স্টেটসমূহ
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const limit = 6; // 🎯 কনস্ট্রেইন: ডিফল্ট কুয়েরি অপারেশন লিমিট সর্বোচ্চ ৯টি

  // 🎯 ২. ডাটা ফেচ করার কোর ফাংশন
  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `https://skillswap-server-one.vercel.app/api/freelancers?page=${currentPage}&limit=${limit}&search=${searchText}&category=${selectedCategory}`;
      
      const response = await fetch(url);
      const resData = await response.json();
      
      if (response.ok) {
        const mainData = resData.data || resData;
        setFreelancers(Array.isArray(mainData) ? mainData : []);
        
        // মেটাডাটা থেকে টোটাল পেজ সংখ্যা নিখুঁতভাবে রিড করা
        const pages = resData.meta?.totalPages || resData.totalPages || 1;
        setTotalPages(Number(pages));
      } else {
        setError(resData.message || "Failed to load freelancers node matrix.");
      }
    } catch (err) {
      console.error("Error synchronizing freelancers matrix:", err);
      setError("Network routing failure. Please verify connection bounds.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 ৩. কারেন্ট পেজ ডিপেন্ডেন্সি ট্র্যাক করার রিঅ্যাক্ট হুক লুপ
  useEffect(() => {
    fetchFreelancers();
  }, [currentPage]);

  // 🔒 কনস্ট্রেইন: সার্চ টেক্সট চেঞ্জ হলে কারেন্ট পেজকে ১ এ রিসেট করা
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); 
  };

  // 🔒 কনস্ট্রেইন: ক্যাটাগরি আইটেম চেঞ্জ হলে কারেন্ট পেজকে ১ এ রিসেট করা
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); 
  };

  // ফিল্টার বাটন বা ফর্ম এন্টার সাবমিট ট্রিগার
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 🏢 হেডার সেকশন */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Available Freelancers
          </h1>
          <p className="text-gray-400 text-lg">
            Hire top-tier industrial experts and talented professionals for your micro-tasks.
          </p>
        </div>

        {/* 🔍 ফিল্টার এবং সার্চ কন্ট্রোল প্যানেল (চ্যালেঞ্জ ৩ অনুযায়ী রিয়েল-টাইম সিঙ্ক) */}
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
          <input 
            type="text" 
            value={searchText} 
            onChange={handleSearchChange} 
            placeholder="Search by freelancer name or email..." 
            className="flex-1 h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs focus:outline-none focus:border-emerald-500 transition"
          />
          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="h-11 bg-[#121216] border border-white/10 rounded-xl px-4 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="All">All Categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 transition font-bold text-xs h-11 rounded-xl px-6 text-white whitespace-nowrap">
            Filter Network
          </button>
        </form>

        {/* ⏳ লোডিং স্টেট কঙ্কাল গ্রিড */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white/5 border border-white/10 h-72 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* ❌ এরর স্টেট ডিসপ্লে */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-xs font-mono">
            {error}
          </div>
        )}

        {/* 📭 কোনো ফ্রিল্যান্সার রেকর্ড না থাকলে */}
        {!loading && freelancers.length === 0 && !error && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-400 text-sm">No contract engineers mapped to your filter criteria.</p>
          </div>
        )}

        {/* 👥 ডাইনামিক ফ্রিল্যান্সার কার্ড গ্রিড (সর্বোচ্চ ৯টি ডকুমেন্ট দেখাবে) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && freelancers.map((freelancer) => (
            <div 
              key={freelancer._id} 
              className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-xl shadow-xl hover:border-emerald-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* প্রোফাইল ইমেজ এবং নাম ও রেট */}
                <div className="flex items-center gap-4">
                  <img 
                    src={freelancer.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    alt={freelancer.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/20 group-hover:border-emerald-500 transition-all"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {freelancer.name}
                    </h2>
                    <p className="text-emerald-400 text-sm font-semibold mt-0.5">
                      ${freelancer.hourly_rate || 25}/hr
                    </p>
                  </div>
                </div>
                
                {/* বায়ো টেক্সট */}
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed min-h-[60px]">
                  {freelancer.bio || "No biography provided by the freelancer yet."}
                </p>

                {/* স্কিলস ট্যাগস তালিকা */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Core Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(freelancer.skills) && freelancer.skills.length > 0 ? (
                      freelancer.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-white/5 border border-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">No skills specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* পাবলিক প্রোফাইল বাটন */}
              <button 
                type="button"
                className="w-full mt-6 bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md text-sm"
                onClick={() => alert(`Viewing profile of ${freelancer.name}`)}
              >
                View Public Profile
              </button>
            </div>
          ))}
        </div>

        {/* 🎯 চ্যালেঞ্জ ৩: ডাইনামিক সার্ভার-সাইড পেজের ইনডেক্স বাটন কন্ট্রোলসমূহ */}
        {!loading && Number(totalPages) >= 1 && freelancers.length > 0 && (
          <div className="flex items-center justify-center space-x-2 pt-6 border-t border-white/5">
            {/* Previous State Button */}
            <button 
              type="button"
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="bg-white/5 border border-white/10 text-xs text-white rounded-xl h-9 px-4 disabled:opacity-30 transition hover:bg-white/10"
            >
              ← Prev
            </button>

            {/* ডাইনামিক পেজ নম্বর জেনারেটর লুপ */}
            {[...Array(totalPages || 1)].map((_, index) => {
              const pageIdx = index + 1;
              return (
                <button 
                  type="button"
                  key={pageIdx}
                  onClick={() => setCurrentPage(pageIdx)}
                  className={`h-9 w-9 text-xs font-black rounded-xl transition-all ${
                    currentPage === pageIdx 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                      : "bg-white/5 hover:bg-white/10 text-gray-400"
                  }`}
                >
                  {pageIdx}
                </button>
              );
            })}

            {/* Next State Button */}
            <button 
              type="button"
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="bg-white/5 border border-white/10 text-xs text-white rounded-xl h-9 px-4 disabled:opacity-30 transition hover:bg-white/10"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}