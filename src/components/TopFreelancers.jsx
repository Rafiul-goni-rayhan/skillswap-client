"use client";

import Link from "next/link";

export default function TopFreelancers({ freelancers, loading }) {
  return (
    <section className="max-w-7xl mx-auto px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">Top Verified Freelancers</h2>
          <p className="text-gray-400 text-sm mt-1">Hire registered contractors with verified skills portfolios.</p>
        </div>
        <Link href="/dashboard/freelancers" className="text-sm font-semibold text-emerald-400 hover:underline self-center md:self-auto">View Management Directory &rarr;</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => <div key={n} className="bg-white/5 border border-white/10 h-60 rounded-2xl animate-pulse" />)}
        </div>
      ) : freelancers.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl text-gray-400 text-sm">No freelancers registered yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div key={freelancer._id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/20 transition-all duration-300 group">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={freelancer.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt={freelancer.name} className="w-12 h-12 rounded-full object-cover border border-white/10" onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }} />
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">{freelancer.name}</h4>
                    <p className="text-emerald-400 text-xs font-semibold">${freelancer.hourly_rate || 25}/hr</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed min-h-[48px]">{freelancer.bio || "Top industry freelancer professional description."}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {freelancer.skills?.slice(0, 4).map((skill, index) => (
                    <span key={index} className="bg-white/5 border border-white/5 text-gray-300 text-[9px] px-2 py-0.5 rounded-md">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}