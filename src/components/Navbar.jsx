"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // লোকাল স্টোরেজ থেকে ইউজারের স্টেট সিঙ্ক করা
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();

    // পেজ বা স্টোরেজ চেঞ্জ ট্র্যাকিংয়ের জন্য লিসেনার
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  // সিকিউর লগআউট হ্যান্ডলার (ব্যাকএন্ড কুকি ও লোকাল স্টোরেজ রিমুভ)
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include", // HTTPOnly কুকি ক্লিয়ার করার জন্য আবশ্যক
      });

      if (response.ok) {
        localStorage.removeItem("user");
        setUser(null);
        alert("Logged out successfully!");
        window.location.href = "/auth/signin"; // লগআউট হলে নতুন সাইন-ইন পাথে রিডাইরেক্ট
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // বেস পাবলিক লিংকস
  const navLinks = [
    { id: "home", label: "Home", href: "/" },
    { id: "browse-tasks", label: "Browse Tasks", href: "/tasks" },
    { id: "browse-freelancers", label: "Browse Freelancers", href: "/dashboard/freelancers" },
  ];

  // SkillSwap-এর জন্য নির্দিষ্ট ড্যাশবোর্ড ম্যাপিং
  const dashboardLinks = {
    client: "/dashboard/client",
    freelancer: "/dashboard/freelancer",
    admin: "/dashboard/admin",
  };

  // ইউজার লগইন থাকলে ডাইনামিকালি ড্যাশবোর্ড ও প্রোফাইল পুশ করা
  if (!loading && user) {
    navLinks.push({
      id: "dashboard",
      label: "Dashboard",
      href: dashboardLinks[user.role] || "/dashboard/client",
    });
    navLinks.push({
      id: "profile",
      label: "Profile",
      href: "/profile",
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO (SkillSwap ব্র্যান্ডিং) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <div className="hidden leading-none sm:block">
            <h1 className="text-lg font-bold text-white tracking-wider">
              <span className="text-emerald-500">Skill</span>Swap
            </h1>
          </div>
        </Link>

        {/* RIGHT SIDE (Desktop Menu) */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex">
            
            {/* Dynamic Nav Links */}
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-6 w-px bg-white/20" />

            {/* Auth Area */}
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-white/10 object-cover"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                  )}
                  <span className="hidden lg:inline">Hi, {user.name}!</span>
                  <Button onClick={handleLogout} variant="ghost" className="border-white/20 text-white hover:bg-white/10">
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    Sign In
                  </Link>
                  <Button
                    as={Link}
                    href="/auth/signup"
                    radius="lg"
                    className="h-11 bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0B0B0F] md:hidden">
          <div className="space-y-3 px-4 py-6">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 pt-4">
              <div className="flex flex-col gap-3">
                {!loading && user ? (
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full bg-neutral-800 font-semibold text-white"
                    radius="lg"
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="rounded-xl px-4 py-3 text-base font-medium text-emerald-400 transition hover:bg-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button
                      as={Link}
                      href="/auth/signup"
                      className="bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                      radius="lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}




