"use client";

import Link from "next/link";

export default function FeaturedTasks({ tasks, loading }) {
  return (
    <section className="max-w-7xl mx-auto px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">Latest Featured Tasks</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time open listings synchronized directly from our marketplace catalog.</p>
        </div>
        <Link href="/tasks" className="text-sm font-semibold text-emerald-400 hover:underline self-center md:self-auto">View All Tasks &rarr;</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => <div key={n} className="bg-white/5 border border-white/10 h-52 rounded-2xl animate-pulse" />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl text-gray-400 text-sm">No tasks posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/20 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-white text-lg line-clamp-1">{task.title}</h3>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{task.category}</span>
                </div>
                <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">{task.description}</p>
                <p className="text-[10px] text-gray-500">By Client: <span className="text-gray-400">{task.client_email}</span></p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Budget</p>
                  <p className="text-base font-bold text-emerald-400">${task.budget}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase">Deadline</p>
                  <p className="text-xs font-medium text-gray-300">{new Date(task.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}