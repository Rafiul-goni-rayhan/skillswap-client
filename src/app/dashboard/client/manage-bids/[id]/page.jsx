"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ClientTaskBidsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id; // 🚀 ইউআরএল থেকে ডাইনামিক [id] রিসিভ করা হলো

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskProposals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/proposals/task/${taskId}`);
        const data = await res.json();

        if (data.success) {
          setBids(data.proposals || []);
        } else {
          toast.error(data.message || "Failed to load proposals.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
        toast.error("Network error while fetching proposals.");
      } finally {
        setLoading(false);
      }
    };

    // 🎯 ফিক্স ১: ফাংশনটি এখানে কল করা হলো যেন পেজ লোড হলেই ডাটা আসে
    fetchTaskProposals(); 

  }, [taskId]); // 🎯 ফিক্স ২: useEffect-এর ব্র্যাকেট এবং ডিপেন্ডেন্সি সঠিকভাবে ক্লোজ করা হলো

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-400 font-mono text-xs animate-pulse">Syncing proposals...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-[#0B0B0F] min-h-screen">
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Freelancer Proposals
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Total <span className="text-emerald-400 font-bold">{bids.length}</span> candidates applied
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/client")}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition"
        >
          Back to Dashboard
        </button>
      </div>

      {bids.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-gray-500 text-sm">
          No freelancers have bid on this job yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bids.map((bid) => (
            <div key={bid._id} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex justify-between border-b border-white/5 pb-2 mb-3">
                <span className="text-emerald-400 font-bold text-sm">📩 {bid.freelancer_email}</span>
                <span className="text-gray-500 text-[10px] font-mono">
                  {new Date(bid.submitted_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-4 text-sm mb-3">
                <div className="bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-xs text-gray-500">Budget:</span> <strong>${bid.proposed_budget}</strong>
                </div>
                <div className="bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-xs text-gray-500">Time:</span> <strong>{bid.estimated_days} Days</strong>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Cover Note</p>
              <p className="text-sm text-gray-300 bg-black/20 p-3 rounded-xl border border-white/5 whitespace-pre-line">
                {bid.cover_note}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}