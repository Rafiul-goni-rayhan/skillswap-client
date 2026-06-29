"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
// 🎯 Better Auth এর ক্লায়েন্ট হুক নিয়ে আসা হলো
import { useSession } from "@/lib/auth-client"; 

function AdminDashboardContent() {
  // Better Auth থেকে সেশন ডাটা নেওয়া হচ্ছে (লোকাল স্টোরেজের বদলে)
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0, totalRevenue: 0 });
  const [usersList, setUsersList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // ১. সেশন লোড এবং অ্যাডমিন গার্ড লজিক (রিয়েল-টাইম সিঙ্ক)
  useEffect(() => {
    if (isSessionLoading) return;

    if (user) {
      // রোল অথবা ইমেইল যেকোনো একটি অ্যাডমিন ম্যাচ করলেই ক্লিয়ারেন্স দিয়ে দেবে
      const isUserAdmin = user.role?.toLowerCase() === "admin" || user.email === "admin@gmail.com";
      
      if (!isUserAdmin) {
        toast.error("❌ Access Denied: Supreme Admin Node Clearance Required!");
        window.location.href = "/";
        return;
      }
      loadAdminData();
    } else {
      window.location.href = "/auth/signin";
    }
  }, [user, isSessionLoading]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 🎯 ফেচ করার সময় ডাবল কোটের বদলে ব্যাকটিক (``) ব্যবহার করা হলো, যাতে এনভায়রনমেন্ট ভেরিয়েবল ঠিকঠাক কাজ করে
      const [statsRes, usersRes, tasksRes, txRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks`, { credentials: "include" }), 
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/transactions`, { credentials: "include" })
      ]);

      const getJsonSafe = async (res) => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          return await res.json();
        }
        return null;
      };

      const statsData = await getJsonSafe(statsRes);
      const usersData = await getJsonSafe(usersRes);
      const tasksData = await getJsonSafe(tasksRes);
      const txData = await getJsonSafe(txRes);

      if (statsData?.success) setStats(statsData.stats);
      
      setUsersList(usersData?.data || usersData || []);
      setTasksList(tasksData?.data || tasksData || []);
      if (txData?.success) setTransactions(txData.transactions);

    } catch (err) {
      console.error("🔥 Admin workspace sync fail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockStatus: !currentStatus }),
        credentials: "include"
      });
      if (response.ok) {
        toast.success(`User status altered successfully!`);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task for guideline violation?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (response.ok) {
        toast.success("Task row purged successfully.");
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Better Auth এর সেশন পেন্ডিং বা ডেটা লোডিংয়ের সময় স্পিনার দেখাবে
  if (isSessionLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-3">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-red-500 text-xs font-mono tracking-widest animate-pulse">SYNCHRONIZING SUPREME CONSOLE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 p-8 space-y-8 font-sans">
      
      {/* HEADER CONTROLS */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Supreme Admin Console</h1>
          <p className="text-red-400 text-xs font-mono mt-1">
            Root Session Security Token Verified: <span className="underline font-bold">{user?.email}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab("overview")} className={`h-9 text-xs font-bold rounded-lg px-4 ${activeTab === "overview" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400"}`}>Overview</Button>
          <Button onClick={() => setActiveTab("users")} className={`h-9 text-xs font-bold rounded-lg px-4 ${activeTab === "users" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400"}`}>Manage Users</Button>
          <Button onClick={() => setActiveTab("tasks")} className={`h-9 text-xs font-bold rounded-lg px-4 ${activeTab === "tasks" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400"}`}>Manage Tasks</Button>
          <Button onClick={() => setActiveTab("transactions")} className={`h-9 text-xs font-bold rounded-lg px-4 ${activeTab === "transactions" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400"}`}>Transactions</Button>
        </div>
      </div>

      {/* 📊 OVERVIEW STATISTICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Users Registered</h3>
              <p className="text-4xl font-black mt-2 text-white">{stats.totalUsers}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Tasks Vector</h3>
              <p className="text-4xl font-black mt-2 text-emerald-400">{stats.totalTasks}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Revenue Escrowed</h3>
              <p className="text-4xl font-black mt-2 text-blue-400">${stats.totalRevenue} USD</p>
            </div>
          </div>
          <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-gray-500 text-xs font-mono">
            Supreme Core Monitoring Node System Online. Select tabs above to commit operational changes.
          </div>
        </div>
      )}

      {/* 👥 MANAGE USERS PAGE */}
      {activeTab === "users" && (
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase font-bold tracking-widest">
                <th className="py-3 px-4">User Identity</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Role Permission</th>
                <th className="py-3 px-4 text-right">Operational Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                  <td className="py-4 px-4 text-gray-400">{u.email}</td>
                  <td className="py-4 px-4 uppercase font-mono text-[10px]">
                    <span className={`px-2 py-0.5 rounded ${u.role === "admin" ? "bg-red-500/20 text-red-400" : u.role === "client" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>{u.role}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {u.role !== "admin" ? (
                      <Button
                        onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                        className={`font-black h-7 rounded-lg text-[10px] uppercase transition ${u.isBlocked ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                      >
                        {u.isBlocked ? "🔄 Unblock Node" : "🚫 Block Node"}
                      </Button>
                    ) : (
                      <span className="text-gray-600 text-[10px] font-mono">Root Immune</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📝 MANAGE TASKS PAGE */}
      {activeTab === "tasks" && (
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase font-bold tracking-widest">
                <th className="py-3 px-4">Task Vector Title</th>
                <th className="py-3 px-4">Budget Size</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4 text-right">Safety Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {tasksList.map((t) => (
                <tr key={t._id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 px-4 font-semibold text-white max-w-xs truncate">{t.title}</td>
                  <td className="py-4 px-4 text-emerald-400 font-bold">${t.budget}</td>
                  <td className="py-4 px-4 uppercase font-mono text-[10px]">
                    <span className={`px-2 py-0.5 rounded ${t.status === "open" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{t.status}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      onClick={() => handleDeleteTask(t._id)}
                      className="bg-red-900/40 border border-red-500/30 hover:bg-red-700 text-red-200 font-bold h-7 rounded-lg text-[10px] uppercase"
                    >
                      🗑️ Purge Row
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 💳 TRANSACTIONS HISTORY VIEW */}
      {activeTab === "transactions" && (
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase font-bold tracking-widest">
                <th className="py-3 px-4">Client Email</th>
                <th className="py-3 px-4">Freelancer Email</th>
                <th className="py-3 px-4">Payout Size</th>
                <th className="py-3 px-4">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {transactions.map((tx, idx) => (
                <tr key={tx._id || idx} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 px-4 text-blue-400 font-medium">{tx.client_email || tx.clientEmail || "escrow@network.com"}</td>
                  <td className="py-4 px-4 text-purple-400 font-medium">{tx.freelancer_email || tx.freelancerEmail || "freelancer@node.com"}</td>
                  <td className="py-4 px-4 text-emerald-400 font-black">${tx.amount || tx.payoutSize}</td>
                  <td className="py-4 px-4 text-gray-500 font-mono text-[11px]">
                    {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 font-mono">No active Stripe matrix assets processed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white"><p className="text-red-500 text-xs font-mono animate-pulse">BOOTING SUPREME WORKSPACE...</p></div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}