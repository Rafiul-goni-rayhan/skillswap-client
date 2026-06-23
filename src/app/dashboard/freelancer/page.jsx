"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function FreelancerDashboard() {
  const [user, setUser] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchFreelancerProposals();
  }, []);

  const fetchFreelancerProposals = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/freelancer/proposals", {
        credentials: "include"
      });
      const data = await response.json();
      
      if (response.ok && data && Array.isArray(data.data)) {
        setProposals(data.data);
      } else {
        setProposals([]);
      }
    } catch (err) {
      console.error("Failed to fetch freelancer proposals:", err);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  // সেফটি অ্যারে হ্যান্ডলিং
  const safeProposals = Array.isArray(proposals) ? proposals : [];

  // অ্যানালিটিক্স ক্যালকুলেশন
  const submittedCount = safeProposals.length;
  const acceptedProposals = safeProposals.filter(p => p?.status === "accepted");
  const acceptedCount = acceptedProposals.length;
  
  // আর্নিং হিসাব: যে প্রোপোজালগুলো ক্লায়েন্ট Accept করেছে, সেগুলোর বিড অ্যামাউন্টের যোগফল
  const totalEarnings = acceptedProposals.reduce((sum, p) => sum + (p?.bidAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Freelancer Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || "Freelancer"}!</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/tasks"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl transition-all shadow-lg shadow-emerald-600/10"
            >
              Browse Available Tasks
            </Link>
          </div>
        </div>

        {/* রিয়েল-টাইম অ্যানালিটিক্স গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium">Submitted Proposals</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">{submittedCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium">Accepted Tasks (Ongoing)</h3>
            <p className="text-3xl font-bold mt-2 text-teal-400">{acceptedCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium">Total Earnings</h3>
            <p className="text-3xl font-bold mt-2 text-white">${totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* মাই প্রোপোজালস লিস্ট */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">My Submitted Bids & Status</h2>
          
          {loading ? (
            <div className="text-gray-400 animate-pulse">Loading your proposals...</div>
          ) : safeProposals.length === 0 ? (
            <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl text-gray-400">
              You haven't placed any bids yet. Go to Browse Tasks to start applying!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {safeProposals.map((proposal) => (
                <div 
                  key={proposal?._id} 
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-xl hover:border-white/20 transition-all"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{proposal?.taskTitle}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        proposal?.status === "accepted" 
                          ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" 
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>
                        {proposal?.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Submitted on: {new Date(proposal?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-white/10 pl-3 italic">
                      "{proposal?.coverLetter}"
                    </p>
                  </div>

                  <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-white/10 w-full md:w-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Your Bid / Duration</p>
                    <p className="text-xl font-bold text-emerald-400">
                      ${proposal?.bidAmount}{" "}
                      <span className="text-xs text-gray-400 font-normal">in {proposal?.duration} days</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}