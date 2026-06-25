"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
// 🚀 ১. Better-Auth ক্লায়েন্ট ইম্পোর্ট করা (তোমার প্রজেক্টের সঠিক পাথ অনুযায়ী মিলিয়ে নিও ভাই)
import { authClient } from "@/lib/auth-client"; 

import { toast } from "react-hot-toast";


export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // 🚀 ২. গুগলের জন্য আলাদা একটি লোডিং স্টেট
  const [googleLoading, setGoogleLoading] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // কাস্টম ইমেইল-পাসওয়ার্ড সাবমিট হ্যান্ডলার (আগের মতো নিখুঁত মেথড)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://skillswap-server-one.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed!");
      }

      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(data.user));

      // alert("Login Successful!");

toast.success("Login Successful! Welcome back.");

      const userRole = data.user?.role?.toLowerCase();

      if (userRole === "admin") {
        window.location.href = "/dashboard/admin";
      } else if (userRole === "client") {
        window.location.href = "/";
      } else if (userRole === "freelancer") {
        window.location.href = "/dashboard/freelancer";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 ৩. গুগল লগইন ট্রিগার ফাংশন
  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // লগইন সফল হলে ড্যাশবোর্ডে হিট করবে ভাই
      });
    } catch (err) {
      console.error("Better-Auth Google Login Error:", err);
      setError(err.message || "Google authentication failed!");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-white px-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl mb-4 border border-red-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email}
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" 
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password}
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" 
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            isLoading={loading}
            disabled={googleLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-xl transition"
          >
            Sign In
          </Button>
        </form>

        {/* 🚀 ৪. ডিভাইডার লাইন */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-3 text-xs text-gray-500 uppercase tracking-wider">Or</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {/* 🚀 ৫. গুগল লগইন বাটন (HeroUI স্টাইলে চমৎকার কালার কম্বিনেশন) */}
        <Button
          type="button"
          isLoading={googleLoading}
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-100 text-black font-semibold h-12 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
        >
          {!googleLoading && (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.4 7.56l3.86 3C6.18 7.56 8.87 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57l3.77 2.92c2.2-2.03 3.68-5.03 3.68-8.64z"/>
              <path fill="#FBBC05" d="M5.26 14.44c-.25-.74-.39-1.52-.39-2.44s.14-1.7.39-2.44L1.4 6.56C.5 8.36 0 10.13 0 12s.5 3.64 1.4 5.44l3.86-3z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.05.7-2.39 1.12-4.19 1.12-3.13 0-5.82-2.52-6.76-5.52l-3.86 3C3.37 20.35 7.35 23 12 23z"/>
            </svg>
          )}
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-emerald-400 hover:underline">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@heroui/react";

// export default function SignInPage() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch("https://skillswap-server-one.vercel.app/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//         credentials: "include", // HTTPOnly কুকি ব্রাউজারে সেট করার জন্য
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed!");
//       }

//       // 🎯 ১. ওল্ড ক্যাশ ডেটা থাকলে তা পুরোপুরি সাফ করা (মোস্ট ইম্পর্ট্যান্ট)
//       localStorage.removeItem("user");

//       // ২. লোকাল স্টোরেজে নতুন ফ্রেশ ডাটা সেভ
//       localStorage.setItem("user", JSON.stringify(data.user));

//       alert("Login Successful!");

//       // 🎯 ৩. রোল ভিত্তিক নিখুঁত রিডাইরেক্ট মেকানিজম (কেস-সেন্সিটিভ সেফ)
//       const userRole = data.user?.role?.toLowerCase(); // ছোট হাতের অক্ষরে কনভার্ট করে চেক

//       if (userRole === "admin") {
//         window.location.href = "/dashboard/admin";
//       } else if (userRole === "client") {
//         window.location.href = "/";
//       } else if (userRole === "freelancer") {
//         window.location.href = "/dashboard/freelancer";
//       } else {
//         window.location.href = "/dashboard";
//       }

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-white px-4">
//       <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-xl">
//         <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
//           Welcome Back
//         </h2>

//         {error && (
//           <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl mb-4 border border-red-500/20">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
//             <input 
//               type="email" 
//               name="email" 
//               required 
//               value={formData.email}
//               onChange={handleChange} 
//               className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" 
//               placeholder="example@mail.com"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
//             <input 
//               type="password" 
//               name="password" 
//               required 
//               value={formData.password}
//               onChange={handleChange} 
//               className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" 
//               placeholder="••••••••"
//             />
//           </div>

//           <Button 
//             type="submit" 
//             isLoading={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-xl transition"
//           >
//             Sign In
//           </Button>
//         </form>

//         <p className="mt-6 text-center text-sm text-gray-400">
//           Don't have an account?{" "}
//           <Link href="/auth/signup" className="text-emerald-400 hover:underline">
//             Sign Up here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }