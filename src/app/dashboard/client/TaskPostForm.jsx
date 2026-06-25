"use client";

import { Button } from "@heroui/react";

export default function TaskPostForm({
  taskTitle, setTaskTitle,
  taskCategory, setTaskCategory,
  budget, setBudget,
  deadline, setDeadline,
  description, setDescription,
  formSubmitting, handlePostTask, router
}) {
  return (
    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto shadow-2xl relative text-white">
      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
        <h2 className="text-lg font-bold text-emerald-400 tracking-tight">Deploy New Software Venture</h2>
        <Button
          onClick={() => router.push("/dashboard/client")}
          className="bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold rounded-xl text-xs h-8 min-w-0 px-3"
        >
          ✕ Cancel
        </Button>
      </div>

      <form onSubmit={handlePostTask} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-semibold uppercase tracking-wider">Task Title</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              placeholder="e.g., Construct Next.js E-Learning Framework"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-semibold uppercase tracking-wider">Task Category</label>
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="w-full bg-[#121216] border border-white/10 h-11 rounded-xl px-4 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-semibold uppercase tracking-wider">Budget Allocation ($)</label>
            <input
              type="number"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-white/5 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              placeholder="500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 font-semibold uppercase tracking-wider">Deadline (In Days)</label>
            <input
              type="number"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-white/5 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              placeholder="7"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1.5 font-semibold uppercase tracking-wider">Project Specifications</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition resize-none"
            placeholder="Describe features, stack expectations, and architectural milestones..."
          />
        </div>

        <Button
          type="submit"
          disabled={formSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-xl transition shadow-xl shadow-emerald-600/10 mt-2"
        >
          {formSubmitting ? "Deploying Core Vectors..." : "🚀 Deploy Task to Network"}
        </Button>
      </form>
    </div>
  );
}