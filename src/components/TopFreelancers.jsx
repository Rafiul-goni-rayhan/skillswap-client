"use client";

import Link from "next/link";

export default function TopFreelancers({ freelancers, loading }) {
  return (
    <section className="max-w-7xl mx-auto px-8 space-y-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">Top Verified Freelancers</h2>
          <p className="text-gray-400 text-sm mt-1">Hire registered contractors with verified skills portfolios.</p>
        </div>
        <Link href="/dashboard/freelancers" className="text-sm font-semibold text-emerald-400 hover:underline self-center md:self-auto">
          View Management Directory &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white/5 border border-white/10 h-60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : freelancers.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl text-gray-400 text-sm">
          No freelancers registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.slice(0, 3).map((freelancer) => (
            <div key={freelancer._id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/20 transition-all duration-300 group">
              <div className="space-y-4">
                
                {/* 👤 প্রোফাইল ইমেজ, নাম ও রেট */}
                <div className="flex items-center gap-3">
                  <img 
                    src={freelancer.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    alt={freelancer.name} 
                    className="w-12 h-12 rounded-full object-cover border border-white/10" 
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }} 
                  />
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">{freelancer.name}</h4>
                    <p className="text-emerald-400 text-xs font-semibold">${freelancer.hourly_rate || 25}/hr</p>
                  </div>
                </div>

                {/* ⭐ ● Average star rating & 💼 ● Total number of finished jobs */}
                <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <span>★</span>
                    {/* 🎯 মঙ্গোডিবি কম্পাসের নতুন 'averageRating' ফিল্ডের সাথে পারফেক্টলি ম্যাপ করা হলো */}
                    <span>
                      {freelancer.averageRating !== undefined && freelancer.averageRating !== null 
                        ? Number(freelancer.averageRating).toFixed(1) 
                        : "0.0"}
                    </span>
                    {/* 🎯 ব্র্যাকেটে টোটাল কতজন মানুষ রেটিং দিয়েছে (ratingCount) সেটাও শো করবে */}
                    <span className="text-[10px] text-gray-500 font-normal">
                      ({freelancer.ratingCount || 0})
                    </span>
                  </div>
                  <span className="text-white/10">|</span>
                  <div className="text-gray-400 font-medium">
                    {/* 🎯 ডাটাবেজ প্রপার্টি ফলব্যাক সহ টোটাল জবস কাউন্ট */}
                    💼 {freelancer.ratingCount || freelancer.completedJobs || freelancer.finishedJobs || 0} Jobs Done
                  </div>
                </div>

                {/* 📝 বায়ো ডিসক্রিপশন */}
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed min-h-[32px]">
                  {freelancer.bio || "Top industry freelancer professional description across dynamic framework models."}
                </p>

                {/* 🏷️ ● Skills list (tags) */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {freelancer.skills && freelancer.skills.length > 0 ? (
                    freelancer.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="bg-white/5 border border-white/5 text-gray-300 text-[10px] px-2.5 py-1 rounded-md uppercase font-mono tracking-wide">
                        {skill}
                      </span>
                    ))
                  ) : (
                    ["React", "Next.js", "Tailwind"].map((skill, index) => (
                      <span key={index} className="bg-white/5 border border-white/5 text-gray-500 text-[10px] px-2.5 py-1 rounded-md uppercase">
                        {skill}
                      </span>
                    ))
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}