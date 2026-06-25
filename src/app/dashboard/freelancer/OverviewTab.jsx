"use client";

import { Card } from "@heroui/react";

export default function OverviewTab({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/[0.01] border border-white/5 p-5 text-white">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Proposals</p>
          <h2 className="text-3xl font-black mt-2 text-white">{stats.total}</h2>
        </Card>
        <Card className="bg-white/[0.01] border border-white/5 p-5 text-white border-l-amber-500/20">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Pending Proposals</p>
          <h2 className="text-3xl font-black mt-2 text-amber-400">{stats.pending}</h2>
        </Card>
        <Card className="bg-white/[0.01] border border-white/5 p-5 text-white border-l-blue-500/20">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Accepted Proposals</p>
          <h2 className="text-3xl font-black mt-2 text-blue-400">{stats.accepted}</h2>
        </Card>
        <Card className="bg-white/[0.01] border border-white/5 p-5 text-white border-l-emerald-500/20">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Earnings (USD)</p>
          <h2 className="text-3xl font-black mt-2 text-emerald-400">${stats.earnings}</h2>
        </Card>
      </div>
    </div>
  );
}