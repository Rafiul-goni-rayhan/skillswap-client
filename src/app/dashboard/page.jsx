"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(true);

  // 🛡️ প্রটেক্টেড রুট লজিক: কাস্টম লগইন সিস্টেমের ইউজার চেক করা
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Localstorage parse error:", err);
        localStorage.removeItem("user");
      }
    } else {
      toast.error("Please login to access the matrix dashboard.");
      router.push("/auth/signin");
    }
    setIsPending(false);
  }, [router]);

  // 🚀 কাস্টম লগআউট হ্যান্ডলার (ম্যানুয়াল JWT + Better-Auth কুকি ক্লিয়ার ফ্রেন্ডলি)
  const handleLogout = async () => {
    try {
      // 🎯 ফিক্সড: credentials: "include" যোগ করা হয়েছে যাতে Better-Auth কুকি ব্যাকএন্ডে পৌঁছায়
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`, {
        method: "POST",
        credentials: "include", // 👈 এই লাইনটি কুকি ক্লিয়ার করার জন্য মাস্ট!
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.removeItem("user");
        toast.success("Logged out successfully from system nodes.");
        router.push("/auth/signin");
      } else {
        toast.error(data.message || "Failed to clear server cookies.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to terminate session matrix.");
    }
  };

  // ⏳ লোডিং স্টেট
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="animate-pulse text-sm font-mono text-emerald-400">
          Decrypting session credentials...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userRole = user.role?.toLowerCase() || "client";

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative group">
        
        {/* গ্লোইং ডিজাইন আর্কিটেকচার */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* কার্ড হেডার */}
        <div className="text-center space-y-4 relative z-10">
          <div className="relative inline-block">
            <img 
              src={user.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt={user.name} 
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-500/20 group-hover:border-emerald-500 transition-all duration-300 shadow-lg"
            />
            <span className="absolute bottom-0 right-2 w-5 h-5 bg-emerald-500 border-4 border-[#0B0B0F] rounded-full"></span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-400 font-mono text-sm">{user.email}</p>
          </div>

          <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
            Role: {user.role || "client"}
          </div>
        </div>

        <hr className="border-white/10 my-8 relative z-10" />

        {/* ইনফরমেশন এবং বাটন ম্যাট্রিক্স */}
        <div className="space-y-6 relative z-10">
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Security Token Info</h3>
            <p className="text-xs text-gray-400 font-mono truncate">User ID: {user._id || "Verified Matrix Account"}</p>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => {
                if (userRole === "admin") {
                  router.push("/dashboard/admin");
                } else if (userRole === "freelancer") {
                  router.push("/dashboard/freelancer");
                } else {
                  router.push("/dashboard/client");
                }
              }}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md text-sm text-center"
            >
              Go to Workspace
            </button>
            
            <button 
              type="button"
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-sm"
            >
              Terminate Session
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession, authClient } from "@/lib/auth-client"; // তোমার auth-client.js এর সঠিক পাথ দাও ভাই
// import toast from "react-hot-toast";

// export default function DashboardPage() {
//   const router = useRouter();
//   const { data: session, isPending, error } = useSession();

//   // 🛡️ প্রটেক্টেড রুট লজিক: লগইন সেশন না থাকলে রিডাইরেক্ট করা
//   useEffect(() => {
//     if (!isPending && !session) {
//       toast.error("Please login to access the matrix dashboard.");
//       router.push("/auth/signin"); // তোমার সাইনের পেজের পাথ অনুযায়ী এটি ম্যাচ করো ভাই
//     }
//   }, [session, isPending, router]);

//   // 🚀 লগআউট হ্যান্ডলার
//   const handleLogout = async () => {
//     try {
//       await authClient.signOut();
//       toast.success("Logged out successfully from system nodes.");
//       router.push("/"); // লগআউট শেষে হোম পেজে রিডাইরেক্ট
//     } catch (err) {
//       console.error("Logout error:", err);
//       toast.error("Failed to terminate session matrix.");
//     }
//   };

//   // ⏳ লোডিং স্টেট
//   if (isPending) {
//     return (
//       <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
//         <div className="animate-pulse text-sm font-mono text-emerald-400">
//           Decrypting session credentials...
//         </div>
//       </div>
//     );
//   }

//   // যদি সেশন না থাকে (রিডাইরেক্ট হওয়ার পূর্ব মুহূর্ত)
//   if (!session) return null;

//   return (
//     <div className="min-h-screen bg-[#0B0B0F] text-white p-8 flex items-center justify-center">
//       <div className="max-w-xl w-full bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative group">
        
//         {/* গ্লোইং ডিজাইন আর্কিটেকচার */}
//         <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
//         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

//         {/* কার্ড হেডার */}
//         <div className="text-center space-y-4 relative z-10">
//           <div className="relative inline-block">
//             <img 
//               src={session.user.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
//               alt={session.user.name} 
//               className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-500/20 group-hover:border-emerald-500 transition-all duration-300 shadow-lg"
//             />
//             <span className="absolute bottom-0 right-2 w-5 h-5 bg-emerald-500 border-4 border-[#0B0B0F] rounded-full"></span>
//           </div>

//           <div className="space-y-1">
//             <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
//               Welcome, {session.user.name}!
//             </h1>
//             <p className="text-gray-400 font-mono text-sm">{session.user.email}</p>
//           </div>

//           <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
//             Role: {session.user.role || "Buyer"}
//           </div>
//         </div>

//         <hr className="border-white/10 my-8 relative z-10" />

//         {/* ইনফরমেশন এবং বাটন ম্যাট্রিক্স */}
//         <div className="space-y-6 relative z-10">
//           <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
//             <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Security Token Info</h3>
//             <p className="text-xs text-gray-400 font-mono truncate">User ID: {session.user.id}</p>
//             <p className="text-xs text-gray-400 font-mono">Plan: {session.user.plan || "Free Tier"}</p>
//           </div>

//           <div className="flex gap-4">
//             <button 
//               type="button"
//               onClick={() => router.push(session.user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client")}
//               className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md text-sm text-center"
//             >
//               Go to Workspace
//             </button>
            
//             <button 
//               type="button"
//               onClick={handleLogout}
//               className="bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-sm"
//             >
//               Terminate Session
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }