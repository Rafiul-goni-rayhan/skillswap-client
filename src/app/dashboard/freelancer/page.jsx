"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Skeleton } from "@heroui/react";

import OverviewTab from "./OverviewTab";
import BrowseTab from "./BrowseTab";
import ProposalsTab from "./ProposalsTab";
import ActiveTab from "./ActiveTab";
import toast from "react-hot-toast";

function FreelancerDashboardContent() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [tasks, setTasks] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, earnings: 0 });

  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeDeliverableTask, setActiveDeliverableTask] = useState(null);

  const [profileName, setProfileName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileSkills, setProfileSkills] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileHourly, setProfileHourly] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    const role = parsedUser?.role?.toLowerCase();

    if (role !== "freelancer") {
      router.push(role === "client" ? "/dashboard/client" : "/");
      return;
    }

    setUser(parsedUser);
    setProfileName(parsedUser.name || "");
    setProfilePhoto(parsedUser.image || "");
    setProfileBio(parsedUser.bio || "");
    setProfileHourly(parsedUser.hourly_rate || "");
    setProfileSkills(parsedUser.skills ? parsedUser.skills.join(", ") : "");

    fetchFreelancerWorkspace(parsedUser.email);
  }, []);

  const fetchFreelancerWorkspace = async (email) => {
    try {
      setLoading(true);
      const [tasksRes, proposalsRes] = await Promise.all([
        fetch("https://skillswap-server-one.vercel.app/api/tasks"),
        fetch(`https://skillswap-server-one.vercel.app/api/freelancer/proposals`, {
          credentials: "include"
        })
      ]);

      const tasksData = await tasksRes.json();
      const proposalsData = await proposalsRes.json();

      const allTasks = tasksData.data || (Array.isArray(tasksData) ? tasksData : []);
      const freelancerBids = proposalsData.data || (Array.isArray(proposalsData) ? proposalsData : []);

      setTasks(allTasks);
      setMyProposals(freelancerBids);

      const pendingBids = freelancerBids.filter(p => p.status?.toLowerCase() === "pending").length;
      const acceptedBids = freelancerBids.filter(p => p.status?.toLowerCase() === "accepted" || p.status?.toLowerCase() === "ongoing").length;
      
      const completedTaskIds = allTasks.filter(t => t.status?.toLowerCase() === "completed").map(t => t._id);
      const income = freelancerBids
        .filter(p => (p.status?.toLowerCase() === "accepted" || p.status?.toLowerCase() === "ongoing") && completedTaskIds.includes(p.task_id))
        .reduce((sum, p) => sum + (Number(p.proposed_budget) || 0), 0);

      setStats({
        total: freelancerBids.length,
        pending: pendingBids,
        accepted: acceptedBids,
        earnings: income
      });
    } catch (err) {
      console.error("Freelancer network matrix sync crash:", err);
    } finally { // 🎯 টাইপো এরর ফিক্সড! 'military' পরিবর্তন করে 'finally' করা হয়েছে।
      setLoading(false);
    }
  };

  const handleDeliverProject = async (e) => {
    e.preventDefault();
    if (!deliverableUrl) return;

    setSubmitting(true);
    try {
      const response = await fetch(`https://skillswap-server-one.vercel.app/api/tasks/${activeDeliverableTask._id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliverable_url: deliverableUrl })
      });

      if (response.ok) {
        toast.success("Deliverable Matrix Registered. Project Status Updated to Completed.");
        setDeliverableUrl("");
        setActiveDeliverableTask(null);
        fetchFreelancerWorkspace(user.email);
      }
    } catch (err) {
      console.error("Delivery processing error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const updatedPayload = {
      bio: profileBio,
      skills: profileSkills,
      hourly_rate: profileHourly
    };

    try {
      const response = await fetch(`https://skillswap-server-one.vercel.app/api/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
        credentials: "include"
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        localStorage.setItem("user", JSON.stringify({ ...user, ...resData.user }));
        toast.success("Public Contractor details updated successfully inside clusters.");
        window.location.reload();
      } else {
        toast.error(resData.message || "Profile update failed.");
      }
    } catch (err) {
      console.error("Profile mutation failure:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const activeProjects = tasks.filter(t => 
    (t.status?.toLowerCase() === "in progress" || t.status?.toLowerCase() === "accepted" || t.status?.toLowerCase() === "ongoing") && 
    myProposals.some(p => p.task_id === t._id && (p.status === "accepted" || p.status === "ongoing"))
  );
  
  const completedProjects = tasks.filter(t => 
    t.status?.toLowerCase() === "completed" && 
    myProposals.some(p => p.task_id === t._id && (p.status === "accepted" || p.status === "ongoing"))
  );

  if (loading && !user) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-1/3 rounded-xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Skeleton className="h-28 rounded-2xl bg-white/5" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 py-4 text-white min-h-screen bg-[#0B0B0F]">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Freelancer Node Terminal</h1>
        <p className="text-xs text-gray-400 mt-1">Contractor: <span className="text-emerald-400 font-bold font-mono">{user?.email}</span></p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        {["overview", "browse", "proposals", "active", "earnings", "profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tab ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab stats={stats} />}

      {activeTab === "browse" && (
        <BrowseTab tasks={tasks} myProposals={myProposals} user={user} fetchFreelancerWorkspace={fetchFreelancerWorkspace} setActiveTab={setActiveTab} />
      )}

      {activeTab === "proposals" && <ProposalsTab myProposals={myProposals} />}

      {activeTab === "active" && (
        <ActiveTab 
          activeProjects={activeProjects} 
          completedProjects={completedProjects} 
          deliverableUrl={deliverableUrl} 
          setDeliverableUrl={setDeliverableUrl} 
          handleDeliverProject={handleDeliverProject} 
          submitting={submitting} 
          activeDeliverableTask={activeDeliverableTask} 
          setActiveDeliverableTask={setActiveDeliverableTask} 
        />
      )}

      {activeTab === "earnings" && (
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider mb-4">Finished Tasks & Payout Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Amount Made</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {myProposals.filter(p => (p.status === "accepted" || p.status === "ongoing") && tasks.some(t => t._id === p.task_id && t.status === "completed")).map(p => (
                  <tr key={p._id} className="hover:bg-white/[0.01]">
                    <td className="py-4 px-4 font-bold text-white">{p.taskTitle || "Marketplace Job"}</td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-400">${p.proposed_budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-white/[0.01] border border-white/10 p-6 rounded-2xl max-w-xl mx-auto shadow-2xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-3 mb-6">Mutate Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Contractor Name</label>
                <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 px-4 text-xs text-white rounded-xl focus:outline-none" disabled />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Hourly Rate (USD)</label>
                <input type="number" required value={profileHourly} onChange={(e) => setProfileHourly(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 px-4 text-xs text-white rounded-xl focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Profile Photo Link</label>
              <input type="url" required value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 px-4 text-xs text-white rounded-xl focus:outline-none" disabled />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Skills (Comma Separated)</label>
              <input type="text" required value={profileSkills} onChange={(e) => setProfileSkills(e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 px-4 text-xs text-white rounded-xl focus:outline-none" placeholder="React, Node.js" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Biography</label>
              <textarea rows="4" required value={profileBio} onChange={(e) => setProfileBio(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white rounded-xl focus:outline-none resize-none" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl">
              {submitting ? "Synchronizing..." : "💾 Commit Profile Mutations"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function FreelancerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-white bg-[#0B0B0F]"><p className="text-emerald-400 text-xs font-mono animate-pulse">Loading Workspace...</p></div>}>
      <FreelancerDashboardContent />
    </Suspense>
  );
}