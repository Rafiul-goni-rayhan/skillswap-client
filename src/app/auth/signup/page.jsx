"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client"; 

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "freelancer", // ডিফল্ট রোল 'freelancer'
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, role: checked ? "freelancer" : "client" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ১. Better-Auth এর মাধ্যমে নরমাল ইমেইল/পাসওয়ার্ড সাইন-আপ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, image, password, role } = formData;

    if (!password) {
      setError("Password cannot be empty.");
      toast.error("Password cannot be empty!");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: email.trim(),
        password: password.trim(),
        name: name.trim(),
        image: image.trim(), // Better-Auth ইমেজ ইউআরএল সাপোর্ট করে
        callbackURL: "/dashboard", // সাইন-আপ সফল হলে রিডাইরেক্ট পাথ
      });

      if (authError) {
        throw new Error(authError.message || "Registration failed!");
      }

      toast.success("Registration Successful!");
      window.location.href = "/dashboard";

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ২. Better-Auth এর মাধ্যমে Google OAuth লগইন/সাইন-আপ
  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // গুগল লগইন সফল হলে রিডাইরেক্ট পাথ
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setGoogleLoading(false);
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

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {/* Google Authentication Button */}
        <Button 
          type="button"
          onClick={handleGoogleLogin}
          isLoading={googleLoading}
          className="w-full bg-white text-black hover:bg-gray-200 font-semibold h-12 rounded-xl transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

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