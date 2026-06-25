"use client";

import { useState } from "react";
import { Button, Card } from "@heroui/react";

export default function BrowseTab({ tasks, myProposals, user, fetchFreelancerWorkspace, setActiveTab }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [proposedBudget, setProposedBudget] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();

    const finalBudget = proposedBudget ? proposedBudget.toString().trim() : "";
    const finalDays = estimatedDays ? estimatedDays.toString().trim() : "";
    const finalNote = coverNote ? coverNote.trim() : "";

    if (!finalBudget || !finalDays || !finalNote) {
      alert("Please fill in all the required bid fields.");
      return;
    }

    const alreadyApplied = myProposals.some((p) => p.task_id === selectedTask._id);
    if (alreadyApplied) {
      alert("Security Block: You have already submitted a proposal application for this task card.");
      return;
    }

    setSubmitting(true);

    const proposalPayload = {
      task_id: selectedTask._id,
      proposed_budget: parseFloat(finalBudget),
      estimated_days: parseInt(finalDays),
      cover_note: finalNote,
    };

    try {
      const response = await fetch("https://skillswap-server-one.vercel.app/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalPayload),
        credentials: "include",
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        alert("Proposal Node Deployed Successfully!");
        setProposedBudget("");
        setEstimatedDays("");
        setCoverNote("");
        setSelectedTask(null);
        fetchFreelancerWorkspace(user.email);
        setActiveTab("proposals");
      } else {
        alert(resData.message || "Failed to transmit ledger payload.");
      }
    } catch (err) {
      console.error("Proposal submission fault:", err);
      alert("Network exception on submission link.");
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedTask) {
    return (
      <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto shadow-2xl relative text-white">
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
          <h2 className="text-sm font-bold text-emerald-400 font-mono">Deploy Proposal Application Vector</h2>
          <Button onClick={() => setSelectedTask(null)} className="bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold rounded-xl text-xs h-8 min-w-0 px-3">✕ Back</Button>
        </div>

        <div className="mb-6 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs space-y-1.5">
          <p className="text-white font-bold text-sm mb-1">{selectedTask.title}</p>
          <p className="text-gray-400"><span className="font-bold">Specifications:</span> {selectedTask.description || "No description provided."}</p>
        </div>

        <form onSubmit={handleProposalSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Proposed Budget (USD)</label>
              <input 
                type="number" 
                required 
                value={proposedBudget} 
                onChange={(e) => setProposedBudget(e.target.value)} 
                className="w-full h-11 bg-white/5 border border-white/10 px-4 text-xs text-white rounded-xl focus:outline-none focus:border-emerald-500 transition" 
                placeholder="e.g. 444" 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Estimated Completion Days</label>
              <input 
                type="number" 
                required 
                value={estimatedDays} 
                onChange={(e) => setEstimatedDays(e.target.value)} 
                className="w-full h-11 bg-white/5 border border-white/10 px-4 text-xs text-white rounded-xl focus:outline-none focus:border-emerald-500 transition" 
                placeholder="e.g. 3" 
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Cover Note Message</label>
            <textarea 
              rows="4" 
              required 
              value={coverNote} 
              onChange={(e) => setCoverNote(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white rounded-xl focus:outline-none resize-none transition" 
              placeholder="Explain your methodology and technical competence..." 
            />
          </div>
          <Button 
            type="submit" 
            disabled={submitting} 
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/10 mt-2"
          >
            {submitting ? "Transmitting Ledger Block..." : "🚀 Transmit Application Ledger Block"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-wider">Open Marketplace Job Blocks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.filter(t => t.status?.toLowerCase() === "open").map(task => (
          <Card key={task._id} className="bg-white/[0.01] border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition group">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">{task.title}</h3>
                <span className="bg-white/5 border border-white/5 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono text-gray-400">{task.category}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-white/[0.02] p-3 rounded-xl text-[11px] font-semibold">
                <div><p className="text-gray-500">Budget</p><p className="text-emerald-400 font-bold font-mono">${task.budget}</p></div>
                <div><p className="text-gray-500">Deadline</p><p className="text-gray-300">{(task.deadline && !isNaN(new Date(task.deadline))) ? Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : task.deadline} Days</p></div>
                <div><p className="text-gray-500">Client</p><p className="text-blue-400 truncate">{task.client_email?.split("@")[0]}</p></div>
              </div>
            </div>
            <Button onClick={() => setSelectedTask(task)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-xl text-xs mt-4">
              Analyze Details & Bid
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}