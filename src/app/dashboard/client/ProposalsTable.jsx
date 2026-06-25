"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";

export default function ProposalsTable({ proposals = [], handleGiveRating, handleAcceptProposal }) {
  
  // 🔬 ১. কমপোনেন্ট লোড বা প্রোপস আপডেট হওয়ার সাথে সাথে পুরো অ্যারে কনসোল করা
  useEffect(() => {
    console.log("📊 [ProposalsTable Node] Mounted/Updated - Raw Array:", proposals);
  }, [proposals]);

  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
      <h2 className="text-base font-bold tracking-tight mb-4 text-white">Incoming Application Proposals</h2>

      {proposals.length === 0 ? (
        <p className="text-gray-500 text-xs py-8 text-center">No developer bids linked to your network nodes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase font-bold tracking-widest">
                <th className="py-3 px-4">Project Scope</th>
                <th className="py-3 px-4">Freelancer Node</th>
                <th className="py-3 px-4">Bid Amount</th>
                <th className="py-3 px-4 text-right">Escrow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {proposals.map((proposal, index) => {
                // 🔬 ২. টেবিল রেন্ডার হওয়ার সময় প্রতিটা একক অবজেক্টের ভেতরের প্রপার্টি ট্র্যাক করা
                console.log(`🔍 [Row Render #${index}] - Task: "${proposal?.taskTitle}", Email Spec: "${proposal?.freelancer_email}", Alt Email: "${proposal?.freelancerEmail}", DB_ID: "${proposal?._id}"`);

                return (
                  <tr key={proposal._id || index} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="py-4 px-4 font-semibold text-white max-w-xs truncate">
                      {proposal?.taskTitle || "Marketplace Venture"}
                    </td>

                    {/* 👥 ফ্রিল্যান্সার নোড এবং রেটিং কলাম */}
                    <td className="py-4 px-4 text-gray-400 font-medium">
                      <div>{proposal?.freelancer_email || proposal?.freelancerEmail || "Missing Email Node"}</div>

                      {/* 🎯 পেমেন্ট সিকিউরড বা অনগোয়িং থাকলে রেটিং ইন্টারফেস */}
                      {(proposal?.status === "accepted" || proposal?.status === "ongoing") && (
                        <div className="flex flex-col gap-1 mt-2 bg-white/5 p-1.5 rounded-lg border border-white/5 w-fit">
                          <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">⭐ Rate Node:</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  // 🔬 ৩. স্টার বাটনে ক্লিক করলে লাইভ ভ্যালু ও প্যারামিটার ট্র্যাক করার লগ
                                  const targetEmail = proposal?.freelancer_email || proposal?.freelancerEmail;
                                  console.log("➡️ [FRONTEND CLICK - RATE] Email Sent:", targetEmail, "| Stars Selected:", star);
                                  handleGiveRating(targetEmail, star);
                                }}
                                className="text-gray-500 hover:text-amber-400 text-sm transition-colors duration-150"
                                title={`Rate ${star} Star`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 font-bold text-emerald-400">
                      ${proposal?.proposed_budget || proposal?.budget || 0}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {proposal?.status === "accepted" || proposal?.status === "ongoing" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Secured & Funded
                        </span>
                      ) : (
                        <Button
                          onClick={() => {
                            // 🔬 ৪. পেমেন্ট বাটনে চাপ দিলে অবজেক্ট ইন্টিগ্রিটি চেক করার লগ
                            console.log("💳 [FRONTEND CLICK - PAY] Invoking Escrow Gate for Proposal Object:", proposal);
                            handleAcceptProposal(proposal);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-8 rounded-lg text-[11px] transition shadow-md px-3"
                        >
                          Accept & Pay via Stripe
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}