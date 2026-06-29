"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';
// 🚀 Better-Auth ক্লায়েন্ট মেথড ইম্পোর্ট করা হলো
import { authClient } from "@/lib/auth-client"; 

export default function DashboardSidebar() {
  const pathname = usePathname();
  
  // 🚀 Better-Auth সেশন হুক (useEffect এবং localStorage পুরোপুরি রিমুভড)
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    try {
      // Better-Auth এর মাধ্যমে সেশন টার্মিনেট করা
      await authClient.signOut();
      window.location.href = "/auth/signin";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Better-Auth সেশন সিঙ্ক হওয়া পর্যন্ত একটি ক্লিন লোডিং স্টেট
  if (isPending) {
    return (
      <div className="w-64 h-screen bg-[#0E0E12] border-r border-white/10 p-6 flex items-center justify-center fixed left-0 top-0 z-40">
        <p className="text-xs text-gray-500 animate-pulse">Syncing Node...</p>
      </div>
    );
  }

  const user = session?.user;
  const role = user?.role?.toLowerCase() || "freelancer";

  // 🛠️ Admin, Client, এবং Freelancer—তিনটি রোলের জন্যই ডাইনামিক মেনু লিংকসমূহ ফিক্সড
  let menuItems = [];

  if (role === "admin") {
    menuItems = [
      { name: "Admin Console", path: "/dashboard/admin", icon: "📊" },
      // { name: "Manage Users", path: "/dashboard/admin/users", icon: "👥" }, 
      { name: "Platform Transactions", path: "/dashboard/admin/transactions", icon: "💳" },
      { name: "Platform Feed", path: "/", icon: "🌐" }
    ];
  } else if (role === "client") {
    menuItems = [
      { name: "Client Console", path: "/dashboard/client", icon: "📊" },
      { name: "Post New Task", path: "/dashboard/client?action=post", icon: "➕" },
      { name: "Browse Freelancers", path: "/freelancers", icon: "🔍" },
      { name: "My Profile", path: "/profile", icon: "👤" }
    ];
  } else {
    // Default: Freelancer / Developer
    menuItems = [
      { name: "Developer Panel", path: "/dashboard/freelancer", icon: "💻" },
      { name: "Marketplace Feed", path: "/", icon: "🌐" },
      { name: "My Portfolio", path: "/profile", icon: "👤" }
    ];
  }

  return (
    <div className="w-64 h-screen bg-[#0E0E12] border-r border-white/10 p-6 flex flex-col justify-between fixed left-0 top-0 z-40">
      <div className="space-y-8">
        
        {/* 🏢 লোগো সেকশন */}
        <div className="px-3 py-2 border-b border-white/5 pb-4">
          <Link href="/" className="text-xl font-black tracking-wider bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent block">
            SkillSwap
          </Link>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              role === 'admin' ? 'bg-red-400' : role === 'client' ? 'bg-blue-400' : 'bg-emerald-400'
            }`}></span>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{role} Node</p>
          </div>
        </div>

        {/* 🔗 ডাইনামিক নেভিগেশন লিংকসমূহ */}
        <nav className="space-y-1.5">
          {menuItems.map((item, index) => {
            const isActive = pathname?.startsWith(item.path.split('?')[0]) && (item.path !== '/' || pathname === '/');
            
            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                    : "text-gray-400 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 👤 প্রোফাইল মেটাডাটা ও লগআউট */}
      <div className="space-y-4 border-t border-white/5 pt-4">
        {user && (
          <div className="flex items-center space-x-3 px-2">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border border-white/10 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs uppercase">
                {user.name?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold h-10 rounded-xl text-xs transition"
        >
          Term Session
        </Button>
      </div>
    </div>
  );
}