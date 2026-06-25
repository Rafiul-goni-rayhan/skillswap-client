"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 🔒 হাইড্রেশন এরর এড়াতে মাউন্ট হওয়া পর্যন্ত অপেক্ষা করা
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9 bg-white/5 rounded-xl animate-pulse" />;

  return (
    <Button
      isIconOnly
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-white/5 hover:bg-white/10 text-white dark:text-yellow-400 rounded-xl transition border border-white/5 h-9 w-9 text-base"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}