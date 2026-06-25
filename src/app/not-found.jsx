"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 🌌 ব্যাকগ্রাউন্ড গ্লো ইফেক্টস */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        
        {/* 📟 বড় ৪MD/404 গ্লিচ টেক্সট */}
        <div className="relative select-none">
          <h1 className="text-[120px] md:text-[160px] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-white/80 to-white/10 bg-clip-text text-transparent opacity-90">
            404
          </h1>
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-emerald-400 bg-[#0B0B0F] px-4 py-1 border border-emerald-500/20 rounded-full shadow-lg shadow-emerald-500/5">
            Endpoint Offline
          </p>
        </div>

        {/* 📝 মেসেজ সেকশন */}
        <div className="space-y-3">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            Lost in the Network Matrix?
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            The requested routing vector or file path does not exist in our system repository. It might have been relocated or terminated.
          </p>
        </div>

        {/* 💻 ছোট একটা ফেক কোড টার্মিনাল প্রিভিউ (লুক বাড়ানোর জন্য) */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-left font-mono text-xs text-gray-500 max-w-sm mx-auto shadow-2xl backdrop-blur-md">
          <div className="flex space-x-1.5 mb-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
          </div>
          <p className="text-red-400/80"><span className="text-gray-600">&gt;</span> Status: 404_NOT_FOUND</p>
          <p className="text-gray-500"><span className="text-gray-600">&gt;</span> Router: app-router-telemetry</p>
          <p className="text-emerald-400/60"><span className="text-gray-600">&gt;</span> Action: redirect_recommended</p>
        </div>

        {/* 🔄 অ্যাকশন বাটন গ্রুপ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xs mx-auto">
          <Button 
            onClick={() => router.push("/")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 rounded-xl transition shadow-xl shadow-emerald-600/10"
          >
            🌐 Back to Feed
          </Button>
          
          <Button 
            onClick={() => router.back()}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold h-11 rounded-xl transition"
          >
            ← Go Back
          </Button>
        </div>

      </div>
    </div>
  );
}