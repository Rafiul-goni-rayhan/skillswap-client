"use client";

export default function ProposalsTab({ myProposals }) {
  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
      <h2 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-wider mb-4">Sent Application Proposal Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              <th className="py-3 px-4">Task Title</th>
              <th className="py-3 px-4">Budget Bid</th>
              <th className="py-3 px-4">Status Text</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {myProposals.map((prop) => (
              <tr key={prop._id} className="hover:bg-white/[0.01]">
                <td className="py-4 px-4 font-bold text-white max-w-xs truncate">{prop.taskTitle || "Marketplace Venture"}</td>
                <td className="py-4 px-4 font-mono font-bold text-emerald-400">${prop.proposed_budget}</td>
                <td className="py-4 px-4 text-left">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    prop.status === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    prop.status === "accepted" || prop.status === "ongoing" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>{prop.status}</span>
                </td>
              </tr>
            ))}
            {myProposals.length === 0 && (
              <tr><td colSpan="3" className="text-center text-gray-500 py-6">No applications sent matching your identity token.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}