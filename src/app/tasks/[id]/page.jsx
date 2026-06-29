"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function TaskDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const taskId = params.id;

  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 🎯 স্টেট প্রপার্টির নামগুলো অফিশিয়াল স্কিমার সাথে সিঙ্ক করা হলো
  const [bidForm, setBidForm] = useState({
    proposed_budget: "",
    estimated_days: "",
    cover_note: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে কারেন্ট ইউজার নেওয়া
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // টাস্ক ডিটেইলস ফেচ করা
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks/${taskId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load task details.");
        }
        setTask(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleInputChange = (e) => {
    setBidForm({ ...bidForm, [e.target.name]: e.target.value });
  };

 const handleBidSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage({ type: "", text: "" });

    // 🎯 ফিক্সড পেলোড: সেশন টোকেন ছাড়াই ইউজারের ইমেইল সরাসরি পাঠানো হচ্ছে
    const proposalPayload = {
      task_id: taskId, 
      freelancer_email: user?.email || "unknown@mail.com", // 👈 লোকালস্টোরেজের ইউজার ইমেইল পাস করা হলো
      proposed_budget: parseFloat(bidForm.proposed_budget) || 0,
      estimated_days: parseInt(bidForm.estimated_days) || 0,
      cover_note: bidForm.cover_note ? bidForm.cover_note.trim() : "",
    };

    // ডিফেন্সিভ ভ্যালিডেশন
    if (!proposalPayload.task_id || !proposalPayload.proposed_budget || !proposalPayload.estimated_days || !proposalPayload.cover_note) {
      setMessage({ type: "error", text: "Please fill up all fields properly." });
      setSubmitLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(proposalPayload), 
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit proposal.");
      }

      setMessage({ type: "success", text: "Your proposal has been submitted successfully!" });
      setBidForm({ proposed_budget: "", estimated_days: "", cover_note: "" });
      
      setTask((prev) => ({ ...prev, proposalsCount: (prev.proposalsCount || 0) + 1 }));

    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="animate-pulse text-xl text-emerald-400">Loading task details...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 font-medium">{error || "Task not found."}</p>
          <Button as={Link} href="/tasks" className="bg-white/5 border border-white/10 text-white">Back to Browse</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* বাম পাশ: টাস্কের বিস্তারিত বিবরণ সেকশন */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-3xl font-bold text-white">{task.title}</h1>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                {task.status}
              </span>
            </div>

            <p className="text-gray-400 text-sm">
              Posted on: {new Date(task.createdAt).toLocaleDateString()} &bull; Total Bids: {task.proposalsCount || 0}
            </p>

            <div className="h-px bg-white/10 my-4" />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Project Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{task.description}</p>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-lg font-semibold text-white">Category</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/5 border border-white/10 text-emerald-400 text-sm px-3 py-1 rounded-xl font-medium">
                  {task.category || "Development"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ডান পাশ: বাজেট সামারি এবং বিডিং ফর্ম */}
        <div className="space-y-6">
          {/* বাজেট ইনফোカード */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Budget</p>
              <p className="text-2xl font-bold text-emerald-400">${task.budget}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Deadline</p>
              <p className="text-sm font-semibold text-gray-300 mt-1">
                {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* বিডিং বা প্রোপোজাল ফর্ম কার্ড */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Submit Your Proposal</h2>
            
            {message.text && (
              <p className={`text-sm p-3 rounded-xl border ${
                message.type === "success" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"
              }`}>
                {message.text}
              </p>
            )}

            {!user ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Please{" "}
                <Link href="/auth/signin" className="text-emerald-400 hover:underline font-semibold">
                  Sign In
                </Link>{" "}
                as a Freelancer to bid on this task.
              </p>
            ) : user.role !== "freelancer" ? (
              <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                Only Freelancer accounts can place bids on tasks.
              </p>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Your Bid Amount ($)</label>
                  <input
                    type="number"
                    name="proposed_budget"
                    required
                    min="1"
                    value={bidForm.proposed_budget}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder={`Max $${task.budget}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Delivery Duration (Days)</label>
                  <input
                    type="number"
                    name="estimated_days"
                    required
                    min="1"
                    value={bidForm.estimated_days}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Cover Note Message</label>
                  <textarea
                    name="cover_note"
                    required
                    rows="5"
                    value={bidForm.cover_note}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition resize-none text-sm"
                    placeholder="Explain why you are the perfect fit for this task..."
                  />
                </div>

                <Button 
                  type="submit" 
                  isLoading={submitLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-xl transition"
                >
                  Submit Proposal
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}