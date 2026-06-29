"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
// Better Auth এর ক্লায়েন্ট মেথড বা হুক
import { useSession } from "@/lib/auth-client"; 

import TaskPostForm from "./TaskPostForm";
import ProposalsTable from "./ProposalsTable";
import toast from "react-hot-toast";

function ClientDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get("action");

  // Better Auth থেকে সেশন এবং লোডিং স্টেট নেওয়া হচ্ছে
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;

  const [proposals, setProposals] = useState([]);
  const [dataLoading, setDataLoading] = useState(false); // ডেটা ফেচিং ট্র্যাকিংয়ের জন্য আলাদা স্টেট
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  // ফর্ম ইনপুট স্টেটসমূহ
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("Development");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // ১. প্রোপোজাল ফেচ করার ফাংশন
 const fetchClientProposals = useCallback(async (email) => {
    if (!email) return;
    
    setDataLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/client/proposals?email=${encodeURIComponent(email)}` // 🎯 ফিক্স: client_email বদলে সরাসরি email করা হলো ব্যাকএন্ডের সাথে মিলিয়ে
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setProposals(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching client proposals:", err);
      toast.error("Failed to fetch freelancer proposals.");
    } finally {
      setDataLoading(false);
    }
  }, []);
  // ২. সেশন লোড হওয়া এবং ইউজার ডেটা কনফার্ম হওয়ার পর এপিআই কল করা
  useEffect(() => {
    if (!isSessionLoading && user?.email) {
      fetchClientProposals(user.email);
    }
  }, [user?.email, isSessionLoading, fetchClientProposals]);

  // URL Action মনিটর করা
  useEffect(() => {
    setIsPostFormOpen(action === "post");
  }, [action]);

 const handlePostTask = async (e) => {
    e.preventDefault();
    
    if (!user?.email) {
      toast.error("Session missing. Please log in again.");
      return;
    }

    if (!taskTitle.trim() || !budget || !deadline || !taskCategory || !description.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    const parsedBudget = parseFloat(budget);
    const parsedDeadline = parseInt(deadline); // যেমন: ৫ বা ১০ দিন

    if (isNaN(parsedBudget) || isNaN(parsedDeadline)) {
      toast.error("Please enter valid numbers for Budget and Deadline.");
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: taskTitle.trim(),
            category: taskCategory,
            budget: parsedBudget,
            deadline: parsedDeadline, // ওরিজনাল নাম্বার পাস
            description: description.trim(),
            client_email: user.email.trim(), // 🎯 সরাসরি সেশন থেকে পাঠানো হলো
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Task Vector Deployed Successfully!");
        setTaskTitle("");
        setTaskCategory("Development");
        setBudget("");
        setDeadline("");
        setDescription("");
        router.push("/dashboard/client");
        fetchClientProposals(user.email); 
      } else {
        toast.error(data.message || "Failed to post task.");
      }
    } catch (err) {
      console.error("Task submission crash:", err);
      toast.error("Network error while submitting task.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposal) => {
    try {
      const finalAmount = parseFloat(proposal?.proposed_budget || 0);
      const finalTitle = proposal?.taskTitle || "SkillSwap Project Milestone";

      if (!finalAmount || finalAmount <= 0) {
        toast.error("Error: Invalid budget detected for checkout.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proposalId: proposal._id,
            taskTitle: finalTitle,
            amount: finalAmount,
          }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.ok && data.url) {
        localStorage.setItem(
          "escrow_payment_pending",
          JSON.stringify(proposal),
        );
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Stripe initialization failed.");
      }
    } catch (err) {
      console.error("Payment routing crash:", err);
    }
  };

  const handleGiveRating = async (freelancerEmail, ratingValue) => {
    if (!freelancerEmail) {
      toast.error("❌ Error: Freelancer email node identifier is missing.");
      return;
    }

    if (!user?.email) {
      toast.error("Active context session expired.");
      return;
    }

    try {
      // 🎯 ফিক্স: হার্ডকোডেড ইউআরএল পরিবর্তন করে এনভায়রনমেন্ট ভেরিয়েবল বসানো হয়েছে
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_id: "",
            reviewer_email: user.email,
            reviewee_email: freelancerEmail.trim(),
            rating: parseFloat(ratingValue),
            comment: "Decentralized task operation successfully evaluated.",
          }),
        },
      );

      const resData = await response.json();

      if (response.ok && resData.success) {
        toast.success("⭐ Review Node Deployed Successfully!");
        fetchClientProposals(user.email); // 🎯 ফিক্স: সেশন ইমেইল পাস করা হলো রিফ্রেশের জন্য
      } else {
        toast.error(
          `❌ REJECT: ${resData.message || "Failed to secure rating node."}`,
        );
      }
    } catch (err) {
      console.error("Rating Submission Error:", err);
      toast.error("Network error: Cannot reach separate collection server.");
    }
  };

  // মূল কন্ডিশন: সেশন লোড হওয়া পর্যন্ত ফুল স্ক্রিন স্পিনার দেখাবে
  if (isSessionLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-400 text-xs font-medium animate-pulse">
          Synchronizing client workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4 flex justify-between items-center text-white">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Client Console</h1>
          <p className="text-gray-400 text-xs mt-1">
            Active Session:{" "}
            <span className="text-blue-400 font-bold">
              {user?.name || "Guest"}
            </span>{" "}
            {user?.email ? `(${user.email})` : ""}
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
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          taskCategory={taskCategory}
          setTaskCategory={setTaskCategory}
          budget={budget}
          setBudget={setBudget}
          deadline={deadline}
          setDeadline={setDeadline}
          description={description}
          setDescription={setDescription}
          formSubmitting={formSubmitting}
          handlePostTask={handlePostTask}
          router={router}
        />
      ) : dataLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
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
    <Suspense
      fallback = {
        <div className="min-h-[60vh] flex items-center justify-center text-white">
          <p className="text-emerald-400 text-xs font-medium animate-pulse">
            Loading Client Workspace...
          </p>
        </div>
      }
    >
      <ClientDashboardContent />
    </Suspense>
  );
}