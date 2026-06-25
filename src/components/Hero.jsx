"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-8 pt-20 text-center space-y-6">
      <div className="absolute inset-0 bg-gradient-to-r blur-3xl -z-10 rounded-full max-w-3xl mx-auto h-72" />
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
        Get your tasks done by <br />
        <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          skilled freelancers
        </span>
      </h1>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
        SkillSwap is a secure micro-task marketplace where clients post simple jobs and premium global talents apply instantly.
      </p>
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button as={Link} href="/dashboard/client" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 px-6 rounded-xl shadow-lg transition duration-300">
          Post a Task
        </Button>
        <Button as={Link} href="/tasks" className="bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold h-12 px-6 rounded-xl transition duration-300">
          Browse Tasks
        </Button>
      </div>
    </section>
  );
}