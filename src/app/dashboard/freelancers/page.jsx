"use client";

import { useEffect, useState } from "react";

export default function BrowseFreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/freelancers");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch freelancers.");
        }
        setFreelancers(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার সেকশন */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Available Freelancers
          </h1>
          <p className="text-gray-400 text-lg">
            Hire top-tier industrial experts and talented professionals for your micro-tasks.
          </p>
        </div>

        {/* লোডিং স্টেট */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white/5 border border-white/10 h-72 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* এরর স্টেট */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* কোনো ফ্রিল্যান্সার না থাকলে */}
        {!loading && freelancers.length === 0 && !error && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-400 text-lg">No freelancers available at the moment.</p>
          </div>
        )}

        {/* ডাইনামিক ফ্রিল্যান্সার কার্ড গ্রিড */}
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
                
                {/* বায়ো টেক্সট */}
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

              {/* অফিশিয়াল ডক অনুযায়ী প্রফেশনাল ভিউ প্রোফাইল অ্যাকশন বাটন */}
              <button 
                className="w-full mt-6 bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md text-sm"
                onClick={() => alert(`Viewing profile of ${freelancer.name}`)}
              >
                View Public Profile
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}