"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";

import TaskPostForm from "./TaskPostForm";
import ProposalsTable from "./ProposalsTable";

function ClientDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get("action");

  const [user, setUser] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  // ফর্ম ইনপুট স্টেটসমূহ
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("Development");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchClientProposals();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsPostFormOpen(action === "post");
  }, [action]);

  const fetchClientProposals = async () => {
    try {
      const response = await fetch("https://skillswap-server-one.vercel.app/api/client/proposals", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setProposals(data.data || data);
      }
    } catch (err) {
      console.error("Error fetching client proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !budget || !deadline || !taskCategory) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    const parsedBudget = parseFloat(budget);
    const parsedDeadline = parseInt(deadline);

    if (isNaN(parsedBudget) || isNaN(parsedDeadline)) {
      alert("Please enter valid numbers for Budget and Deadline.");
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await fetch("https://skillswap-server-one.vercel.app/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle.trim(),
          category: taskCategory,
          budget: parsedBudget,
          deadline: parsedDeadline,
          description: description.trim() || "",
          client_email: user?.email,
          status: "open",
        }),
        credentials: "include",
      });

      if (response.ok) {
        alert("Task Vector Deployed Successfully!");
        setTaskTitle("");
        setTaskCategory("Development");
        setBudget("");
        setDeadline("");
        setDescription("");
        router.push("/dashboard/client");
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to post task.");
      }
    } catch (err) {
      console.error("Task submission crash:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposal) => {
    try {
      const finalAmount = parseFloat(proposal?.proposed_budget || 0);
      const finalTitle = proposal?.taskTitle || "SkillSwap Project Milestone";

      if (!finalAmount || finalAmount <= 0) {
        alert("Error: Invalid budget detected for checkout.");
        return;
      }

      const response = await fetch("https://skillswap-server-one.vercel.app/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: proposal._id,
          taskTitle: finalTitle,
          amount: finalAmount,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.url) {
        localStorage.setItem("escrow_payment_pending", JSON.stringify(proposal));
        window.location.href = data.url;
      } else {
        alert(data.message || "Stripe initialization failed.");
      }
    } catch (err) {
      console.error("Payment routing crash:", err);
    }
  };

  // 🎯 ফিক্সড হ্যান্ডলার: আনডিফাইন্ড ভ্যারিয়েবল ক্র্যাশ সেফ করা হয়েছে
  const handleGiveRating = async (freelancerEmail, ratingValue) => {
    if (!freelancerEmail) {
      alert("❌ Error: Freelancer email node identifier is missing.");
      return;
    }

    try {
      const response = await fetch("https://skillswap-server-one.vercel.app/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          task_id: "", 
          reviewer_email: user?.email || "client@network.com",
          reviewee_email: freelancerEmail.trim(), 
          rating: parseFloat(ratingValue),
          comment: "Decentralized task operation successfully evaluated."
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        alert("⭐ Review Node Deployed into Separate Collection Successfully!");
        fetchClientProposals(); // ড্যাশবোর্ড ডাটা রিফ্রেশ
      } else {
        alert(`❌ REJECT: ${resData.message || "Failed to secure rating node."}`);
      }
    } catch (err) {
      console.error("Rating Submission Error:", err);
      alert("Network error: Cannot reach separate collection server.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-400 text-xs font-medium animate-pulse">Synchronizing client workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4 flex justify-between items-center text-white">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Client Console</h1>
          <p className="text-gray-400 text-xs mt-1">
            Active Session: <span className="text-blue-400 font-bold">{user?.name}</span> ({user?.email})
          </p>
        </div>
        {!isPostFormOpen && (
          <Button
            onClick={() => router.push("/dashboard/client?action=post")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-4 h-10 transition shadow-lg"
          >
            ➕ Post New Task
          </Button>
        )}
      </div>

      {isPostFormOpen ? (
        <TaskPostForm
          taskTitle={taskTitle} setTaskTitle={setTaskTitle}
          taskCategory={taskCategory} setTaskCategory={setTaskCategory}
          budget={budget} setBudget={setBudget}
          deadline={deadline} setDeadline={setDeadline}
          description={description} setDescription={setDescription}
          formSubmitting={formSubmitting} handlePostTask={handlePostTask} router={router}
        />
      ) : (
        <ProposalsTable
          proposals={proposals}
          handleGiveRating={handleGiveRating}
          handleAcceptProposal={handleAcceptProposal}
        />
      )}
    </div>
  );
}

export default function ClientDashboard() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-white"><p className="text-emerald-400 text-xs font-medium animate-pulse">Loading Client Workspace...</p></div>}>
      <ClientDashboardContent />
    </Suspense>
  );
}