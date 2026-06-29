"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ClientTaskBidsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id; 

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(null); 

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

    fetchTaskProposals(); 
  }, [taskId]);

 
  const handleAcceptAndPay = async (bid) => {
    try {
      setPayLoading(bid._id); 
      
      const finalAmount = parseFloat(bid.proposed_budget || 0);
      
      if (!finalAmount || finalAmount <= 0) {
        toast.error("Error: Invalid budget detected for checkout.");
        return;
      }

      // স্ট্রাইপ সেশন তৈরি করার জন্য ব্যাকএন্ডে হিট করা হচ্ছে (টোকেন-মুক্ত ওপেন এপিআই)
      const response = await fetch("${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: bid._id,
          taskTitle: "SkillSwap Job Milestone Deployment",
          amount: finalAmount,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        // পেমেন্ট পেন্ডিং ট্র্যাকিংয়ের জন্য লোকালস্টোরেজে ডাটা ব্যাকআপ রাখা
        localStorage.setItem("escrow_payment_pending", JSON.stringify(bid));
        
        // সরাসরি স্ট্রাইপের সিকিউর পেমেন্ট চেকআউট পেজে রিডাইরেক্ট
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Stripe initialization failed.");
      }
    } catch (err) {
      console.error("Payment routing crash:", err);
      toast.error("Stripe gateway network error.");
    } finally {
      setPayLoading(null);
    }
  };

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
            <div key={bid._id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between gap-4 md:flex-row md:items-start">
              
              {/* বাম পাশের ডাটা পার্ট */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-emerald-400 font-bold text-sm">📩 {bid.freelancer_email}</span>
                  <span className="text-gray-500 text-[10px] font-mono">
                    {new Date(bid.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-4 text-sm">
                  <div className="bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-xs text-gray-500">Budget:</span> <strong>${bid.proposed_budget}</strong>
                  </div>
                  <div className="bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-xs text-gray-500">Time:</span> <strong>{bid.estimated_days} Days</strong>
                  </div>
                  <div className="bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5 uppercase text-[10px] font-black flex items-center tracking-wider">
                    Status: <span className="ml-1 text-yellow-400">{bid.status || 'pending'}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Cover Note</p>
                  <p className="text-sm text-gray-300 bg-black/20 p-3 rounded-xl border border-white/5 whitespace-pre-line leading-relaxed">
                    {bid.cover_note}
                  </p>
                </div>
              </div>

              {/* 🚀 ডান পাশের অ্যাকশন বাটন পার্ট */}
              <div className="md:mt-8 min-w-[160px] flex md:justify-end">
                {bid.status === "accepted" ? (
                  <button disabled className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black py-3 px-4 rounded-xl cursor-not-allowed uppercase tracking-wider">
                    ✓ Accepted & Hired
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={payLoading !== null}
                    onClick={() => handleAcceptAndPay(bid)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    {payLoading === bid._id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "💳 Approve & Pay"
                    )}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}