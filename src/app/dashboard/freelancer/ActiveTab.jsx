"use client";

import { useState } from "react";
import { Button, Card } from "@heroui/react";

export default function ActiveTab({ activeProjects, completedProjects, deliverableUrl, setDeliverableUrl, handleDeliverProject, submitting, activeDeliverableTask, setActiveDeliverableTask }) {
  return (
    <div className="space-y-8">
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-bold font-mono text-blue-400 uppercase tracking-wider mb-4">In Progress Node Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeProjects.map(project => (
            <Card key={project._id} className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-white">
              <div className="flex justify-between mb-3"><h4 className="font-bold text-sm truncate">{project.title}</h4><span className="bg-blue-500/10 text-blue-400 text-[9px] font-black border border-blue-500/20 rounded px-2 uppercase py-0.5">In Progress</span></div>
              <p className="text-gray-400 text-xs mb-4 line-clamp-2">{project.description}</p>
              <Button onClick={() => setActiveDeliverableTask(project)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 rounded-xl text-xs">
                📥 Submit Deliverable Node
              </Button>
            </Card>
          ))}
          {activeProjects.length === 0 && <p className="text-gray-500 text-xs col-span-2 py-4">No active execution threads currently operating.</p>}
        </div>
      </div>

      {activeDeliverableTask && (
        <div className="bg-white/[0.02] border border-blue-500/20 p-5 rounded-2xl max-w-md mx-auto">
          <p className="text-xs font-bold font-mono text-blue-400 mb-2">Deploy Task Deliverable Target</p>
          <form onSubmit={handleDeliverProject} className="space-y-3">
            <input type="url" required value={deliverableUrl} onChange={(e) => setDeliverableUrl(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 px-4 text-xs text-white rounded-xl focus:outline-none" placeholder="e.g. GitHub Repository Link" />
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-xl text-xs">Verify Completion</Button>
              <Button onClick={() => setActiveDeliverableTask(null)} className="bg-white/5 text-gray-400 h-9 text-xs rounded-xl px-4">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-bold font-mono text-gray-500 uppercase tracking-wider mb-4">Completed Projects Repository</h2>
        <div className="space-y-3">
          {completedProjects.map(project => (
            <div key={project._id} className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex justify-between items-center text-xs">
              <div><p className="text-white font-bold">{project.title}</p><p className="text-gray-500 text-[10px] mt-0.5">Budget Allocation: ${project.budget}</p></div>
              <a href={project.deliverable_url} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline font-mono">View Deliverable Matrix ↗</a>
            </div>
          ))}
          {completedProjects.length === 0 && <p className="text-gray-500 text-xs py-2">No completed repository items logged yet.</p>}
        </div>
      </div>
    </div>
  );
}