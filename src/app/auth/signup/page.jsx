"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { toast } from "react-hot-toast";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "client", // ডিফল্ট রোল 'client'
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      // চয়েস বক্স টিক দিলে 'freelancer', না দিলে 'client'
      setFormData((prev) => ({ ...prev, role: checked ? "freelancer" : "client" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, image, password, role } = formData;

    // পাসওয়ার্ড ভ্যালিডেশন পলিসি চেক (Section 06)
    if (!password) {
  setError("Password cannot be empty.");
  toast.error("Password cannot be empty!");
  setLoading(false);
  return;
}
    // if (password.length < 6) {
    //   setError("Password must be at least 6 characters long.");
    //   setLoading(false);
    //   return;
    // }
    // if (!/[A-Z]/.test(password)) {
    //   setError("Password must contain at least one capital letter.");
    //   setLoading(false);
    //   return;
    // }
    // if (!/[a-z]/.test(password)) {
    //   setError("Password must contain at least one lowercase letter.");
    //   setLoading(false);
    //   return;
    // }

    try {
      // ডাটাবেজে ডাটা পাঠানোর জন্য ব্যাকএন্ডের সঠিক ৫০0০ পোর্টে এপিআই কল
      const response = await fetch("https://skillswap-server-one.vercel.app/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          image: image.trim(),
          password: password.trim(),
          role: role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed!");
      }

      toast.success("Registration Successful! Now please sign in.");
      
      // সাকসেসফুল হলে নতুন তৈরি করা সাইন-ইন পাথে রিডাইরেক্ট
      window.location.href = "/auth/signin";

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-white px-4 py-12">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        
        {/* এরর মেসেজ ব্লক */}
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl mb-4 border border-red-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name}
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" 
              placeholder="John Doe"
            />
          </div>
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
            <label className="block text-sm font-medium mb-1 text-gray-300">Image URL</label>
            <input 
              type="url" 
              name="image" 
              required 
              value={formData.image}
              onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" 
              placeholder="https://example.com/photo.jpg"
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
          
          {/* Freelancer রোল সিলেক্ট করার অপশন */}
          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="role" 
              name="role" 
              checked={formData.role === "freelancer"}
              onChange={handleChange} 
              className="w-4 h-4 text-emerald-600 bg-white/5 border-white/10 rounded focus:ring-emerald-500 cursor-pointer" 
            />
            <label htmlFor="role" className="text-sm text-gray-300 cursor-pointer select-none">
              Register as a Freelancer
            </label>
          </div>

          <Button 
            type="submit" 
            isLoading={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-xl transition"
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-emerald-400 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
// "use client";
// import { useState } from "react";
// import Link from "next/link";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     image: "",
//     password: "",
//     role: "client", // ডিফল্ট রোল 'client' থাকবে
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       // চেক করা থাকলে 'freelancer', না থাকলে 'client'
//       setFormData({ ...formData, role: checked ? "freelancer" : "client" });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const { name, email, image, password, role } = formData;

//     // SECTION 06: পাসওয়ার্ড ভ্যালিডেশন রুলস (ফ্রন্টএন্ড চেক)
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long.");
//       setLoading(false);
//       return;
//     }
//     if (!/[A-Z]/.test(password)) {
//       setError("Password must contain at least one capital letter.");
//       setLoading(false);
//       return;
//     }
//     if (!/[a-z]/.test(password)) {
//       setError("Password must contain at least one lowercase letter.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // ব্যাকএন্ডের সঠিক পোর্ট (5000) এ রিকোয়েস্ট পাঠানো হচ্ছে
//       const response = await fetch("https://skillswap-server-one.vercel.app/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, email, image, password, role }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed!");
//       }

//       alert("Registration Successful! Redirecting to login page...");
//       window.location.href = "/login";

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4 py-12">
//       <div className="max-w-md w-full bg-neutral-900 p-8 rounded-lg border border-neutral-800 shadow-xl">
//         <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
        
//         {/* এরর মেসেজ দেখানোর ব্লক */}
//         {error && (
//           <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded mb-4 border border-red-500/20">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Name</label>
//             <input 
//               type="text" 
//               name="name" 
//               required 
//               value={formData.name}
//               onChange={handleChange} 
//               className="w-full bg-neutral-800 border border-neutral-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-500" 
//               placeholder="John Doe"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Email Address</label>
//             <input 
//               type="email" 
//               name="email" 
//               required 
//               value={formData.email}
//               onChange={handleChange} 
//               className="w-full bg-neutral-800 border border-neutral-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-500" 
//               placeholder="example@mail.com"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Image URL</label>
//             <input 
//               type="url" 
//               name="image" 
//               required 
//               value={formData.image}
//               onChange={handleChange} 
//               className="w-full bg-neutral-800 border border-neutral-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-500" 
//               placeholder="https://example.com/photo.jpg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Password</label>
//             <input 
//               type="password" 
//               name="password" 
//               required 
//               value={formData.password}
//               onChange={handleChange} 
//               className="w-full bg-neutral-800 border border-neutral-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-500" 
//               placeholder="••••••••"
//             />
//           </div>
          
//           {/* SECTION 06: Freelancer হিসেবে সাইন-আপ করার চেক বক্স */}
//           <div className="flex items-center space-x-2 py-2">
//             <input 
//               type="checkbox" 
//               id="role" 
//               name="role" 
//               checked={formData.role === "freelancer"}
//               onChange={handleChange} 
//               className="w-4 h-4 text-emerald-600 bg-neutral-800 border-neutral-700 rounded focus:ring-emerald-500 cursor-pointer" 
//             />
//             <label htmlFor="role" className="text-sm text-neutral-300 cursor-pointer select-none">
//               Register as a Freelancer
//             </label>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading} 
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-2.5 rounded transition disabled:opacity-50"
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-neutral-400">
//           Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Login here</Link>
//         </p>
//       </div>
//     </div>
//   );
// }