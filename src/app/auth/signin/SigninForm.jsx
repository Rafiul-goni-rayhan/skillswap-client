"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // HTTPOnly কুকি ব্রাউজারে সেট করার জন্য
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed!");
      }

      // লোকাল স্টোরেজে ডাটা সেভ (Navbar সিঙ্কের জন্য)
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful!");

      // রোল ভিত্তিক ড্যাশবোর্ডে রিডাইরেক্ট
      const userRole = data.user.role;
      if (userRole === "client") {
        window.location.href = "/";
      } else if (userRole === "freelancer" || userRole === "admin") {
        window.location.href = `/dashboard/${userRole}`;
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-xl transition"
          >
            Sign In
          </Button>
        </form>

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