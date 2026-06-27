"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FreelancerDetails() {
  const { id } = useParams(); 
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSingleFreelancer = async () => {
      try {
        setLoading(true);
        setError("");
        
        // 🚀 আমাদের নতুন তৈরি করা ডেডিকেটেড ব্যাকএন্ড এপিআই-তে হিট করছি ভাই
        const response = await fetch(`https://skillswap-server-one.vercel.app/api/freelancers/${id}`);
        const resData = await response.json();
        
        if (response.ok && resData.success) {
          setFreelancer(resData.data);
        } else {
          setError(resData.message || "Failed to load freelancer metadata.");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Network error. Could not reach server nodes.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSingleFreelancer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="animate-pulse text-sm font-mono text-emerald-400">Synchronizing profile nodes...</div>
      </div>
    );
  }

  if (error || !freelancer) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-xs font-mono max-w-md w-full">
          {error || "Freelancer data structure unmapped."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative group">
        
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <img 
            src={freelancer.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
            alt={freelancer.name} 
            className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500/20 group-hover:border-emerald-500 transition-all duration-300"
          />
          <div className="space-y-2 text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              {freelancer.name}
            </h1>
            <p className="text-gray-400 font-mono text-sm">{freelancer.email}</p>
            <div className="inline-block bg-emerald-500/10 text-emerald-400 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mt-1">
              Hourly Rate: ${freelancer.hourly_rate || 25}/hr
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-6" />

        <div className="space-y-4 relative z-10">
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Biography</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {freelancer.bio || "No biography provided by the freelancer yet."}
            </p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Core Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(freelancer.skills) && freelancer.skills.length > 0 ? (
                freelancer.skills.map((skill, index) => (
                  <span key={index} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-xl">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500 italic">No specific skills listed.</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}