"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PlatformTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // 🚀 আপনার ব্যাকএন্ডের ওরিজনাল এপিআই ইউআরএল
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // যদি লোকালহোস্টে কুকি বা সেশন ট্র্যাকিং লাগে তবে credentials: "include" দিতে পারেন
          }
        });

        const resData = await response.json();

        if (resData.success) {
          setTransactions(resData.transactions || []);
        } else {
          toast.error(resData.message || "Failed to load transactions.");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Network error while loading transactions ledger.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // মোট রেভিনিউ হিসাব করা
  const totalRevenue = transactions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="p-6 text-white bg-[#0B0B0F] min-h-screen">
      
      {/* 💳 হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Platform Transactions
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitor and audit escrow payment logs across the ecosystem.
          </p>
        </div>

        {/* 📊 রেভিনিউ কাউন্টার কার্ড */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/5 min-w-[200px]">
          <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider">Total Revenue</p>
          <p className="text-2xl font-black text-white mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading transaction matrix assets...</p>
      ) : transactions.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-gray-500">
          No transactions recorded on the platform yet.
        </div>
      ) : (
        /* 📋 ট্রানজেকশন টেবিল */
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 pl-2">Transaction ID</th>
                <th className="pb-3">Client Email</th>
                <th className="pb-3">Freelancer Email</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx._id} className="text-gray-300 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pl-2 font-mono text-xs text-teal-400 select-all">
                    {tx.transaction_id || tx._id}
                  </td>
                  <td className="py-3.5 text-gray-400 max-w-[200px] truncate">{tx.client_email}</td>
                  <td className="py-3.5 text-gray-400 max-w-[200px] truncate">{tx.freelancer_email}</td>
                  <td className="py-3.5 font-bold text-white">
                    ${parseFloat(tx.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {tx.payment_status || 'Succeeded'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}