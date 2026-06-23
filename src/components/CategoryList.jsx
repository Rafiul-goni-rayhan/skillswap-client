"use client";

import Link from "next/link";

export default function CategoryList() {
  return (
    <section className="max-w-7xl mx-auto px-8 space-y-8">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold">Popular Categories</h2>
        <p className="text-gray-400 text-sm mt-1">Explore job boards filtered by core technology ecosystems.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {["Development", "Design", "Writing", "Marketing", "Other"].map((cat, i) => (
          <Link key={i} href={`/tasks?category=${cat}`} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center backdrop-blur-xl hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-300 group">
            <p className="font-semibold text-gray-200 group-hover:text-emerald-400 transition-colors text-sm">{cat}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}