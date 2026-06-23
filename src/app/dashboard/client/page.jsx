"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", budget: "", deadline: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const [proposalsLoading, setProposalsLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchClientProposals();
  }, []);

  const fetchClientProposals = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/client/proposals", {
        credentials: "include"
      });
      const data = await response.json();
      // ডাটা যদি অ্যারে ফরমেটে আসে তবেই সেভ করবে (ক্র্যাশ প্রোটেকশন)
      if (response.ok && data && Array.isArray(data.data)) {
        setProposals(data.data);
      } else {
        setProposals([]);
      }
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setProposals([]);
    } finally {
      setProposalsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    const tagsArray = formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [];

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, budget: formData.budget, tags: tagsArray }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to post task.");

      setMessage({ type: "success", text: "Task posted successfully!" });
      setFormData({ title: "", description: "", budget: "", deadline: "", tags: "" });
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage({ type: "", text: "" });
      }, 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    if (!confirm("Are you sure you want to accept this proposal?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/proposals/${proposalId}/accept`, {
        method: "PATCH",
        credentials: "include"
      });

      if (response.ok) {
        alert("Proposal Accepted!");
        fetchClientProposals();
      } else {
        alert("Failed to accept proposal.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe Mapping কাউন্ট (প্রোপোজাল অ্যারে খালি থাকলেও ক্র্যাশ করবে না)
  const safeProposals = Array.isArray(proposals) ? proposals : [];
  const uniqueTaskCount = new Set(safeProposals.map(p => p?.taskId).filter(Boolean)).size;
  const activeProjectsCount = safeProposals.filter(p => p?.status === "accepted").length;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Client Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || "Client"}!</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold radius-lg">
            Post a New Task
          </Button>
        </div>

        {/* অ্যানালিটিক্স গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium">Tasks with Bids</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">{uniqueTaskCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium">Active (Ongoing) Projects</h3>
            <p className="text-3xl font-bold mt-2 text-teal-400">{activeProjectsCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium">Total Proposals Received</h3>
            <p className="text-3xl font-bold mt-2 text-white">{safeProposals.length}</p>
          </div>
        </div>

        {/* پروپোজাল লিস্ট সেকশন */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Received Bids & Proposals</h2>
          
          {proposalsLoading ? (
            <div className="text-gray-400 animate-pulse">Loading received bids...</div>
          ) : safeProposals.length === 0 ? (
            <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl text-gray-400">
              No proposals received yet for your posted tasks.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {safeProposals.map((proposal) => (
                <div key={proposal?._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-xl">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {proposal?.taskTitle || "Unknown Task"}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
                        proposal?.status === "accepted" ? "bg-teal-500/20 text-teal-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {proposal?.status || "pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">From: <span className="text-white font-medium">{proposal?.freelancer?.email || "Freelancer"}</span></p>
                    <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-white/10 pl-3 italic">"{proposal?.coverLetter || ""}"</p>
                  </div>

                  <div className="flex md:flex-col justify-between w-full md:w-auto items-center md:items-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-500 uppercase">Offer / Duration</p>
                      <p className="text-lg font-bold text-white">${proposal?.bidAmount || 0} <span className="text-xs text-gray-400 font-normal">in {proposal?.duration || 0} days</span></p>
                    </div>
                    {proposal?.status !== "accepted" && (
                      <Button onClick={() => handleAcceptProposal(proposal?._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold radius-lg text-sm px-4 py-2">
                        Accept Bid
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#0B0B0F] border border-white/10 w-full max-w-lg p-6 rounded-2xl space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h2 className="text-xl font-bold text-white">Create a New Task</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-xl">&times;</button>
              </div>
              {message.text && <p className={`text-sm p-3 rounded-xl border ${message.type === "success" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>{message.text}</p>}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Task Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" placeholder="Build a Next.js App" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                  <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition resize-none" placeholder="Requirements..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Budget ($)</label>
                    <input type="number" name="budget" required min="1" value={formData.budget} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" placeholder="500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Deadline</label>
                    <input type="date" name="deadline" required value={formData.deadline} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition color-scheme-dark" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Required Skills</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition" placeholder="React, MongoDB" />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium radius-lg">Cancel</Button>
                  <Button type="submit" isLoading={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold radius-lg">Submit Task</Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}