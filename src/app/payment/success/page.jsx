"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const proposalId = searchParams.get("proposalId");

  const [txData, setTxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || !proposalId) {
      setError("Payment tokens missing or session context expired.");
      setLoading(false);
      return;
    }

    const verifyTransactionAndSaveToDb = async () => {
      try {
        // ১. স্ট্রাইপ সেশন কনফার্মেশন এপিআই হিট করা
        const response = await fetch("http://localhost:5000/api/confirm-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, proposalId }),
          credentials: "include" // JWT কুকি সেশন পাস করার জন্য বাধ্যতামূলক
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Stripe validation rejected.");
        }

        const verifiedData = data.data;
        setTxData(verifiedData);

        // 🎯 ২. SECTION 13 অনুযায়ী payments কালেকশনে ডাটা ইনসার্ট করার এপিআই কল
        await fetch("http://localhost:5000/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_email: verifiedData?.clientEmail || verifiedData?.client_email,
            freelancer_email: verifiedData?.freelancerEmail || verifiedData?.freelancer_email,
            task_id: verifiedData?.taskId || verifiedData?.task_id,
            amount: parseFloat(verifiedData?.amount),
            transaction_id: sessionId?.substring(0, 20) // স্ট্রাইপ সেশন আইডি থেকে ট্রানজেকশন আইডি জেনারেট
          }),
          credentials: "include"
        });

      } catch (err) {
        console.error("Verification Matrix Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyTransactionAndSaveToDb();
  }, [sessionId, proposalId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-400 font-medium animate-pulse">Securing transaction parameters & double-checking database vectors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6 shadow-2xl relative">
        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -z-10" />

        {error ? (
          <>
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 text-2xl font-bold">✕</div>
            <h1 className="text-xl font-bold text-red-400">Verification Engine Offline</h1>
            <p className="text-gray-400 text-sm">{error}</p>
            <Button onClick={() => router.push("/dashboard/client")} className="w-full bg-white/5 border border-white/10 text-white rounded-xl">Return to Client Dashboard</Button>
          </>
        ) : (
          <>
            {/* 🎯 ১. Clear success transaction confirmation message text */}
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl font-bold">✓</div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white">Payment Successful!</h1>
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Escrow Ledger Secured</p>
            </div>

            <div className="h-px bg-white/10 my-4" />

            {/* 🎯 ২. Display paid task title, worker name, and price size */}
            <div className="text-left space-y-4 bg-white/5 border border-white/5 p-5 rounded-xl text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Project Task</p>
                <p className="font-bold text-white text-base line-clamp-1 mt-0.5">{txData?.taskTitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Hired Worker</p>
                  <p className="font-semibold text-gray-300 mt-0.5">{txData?.freelancerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Price Size</p>
                  <p className="font-black text-emerald-400 text-lg mt-0.5">${txData?.amount}</p>
                </div>
              </div>
            </div>

            {/* 🎯 ৩. An easy navigation button labeled "Go to Dashboard" */}
            <Button 
              onClick={() => router.push("/dashboard/client")} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl transition shadow-lg shadow-emerald-600/10"
            >
              Go to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="animate-pulse text-emerald-400">Loading payment module telemetry...</div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}




// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Button } from "@heroui/react";

// function SuccessPageContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const sessionId = searchParams.get("session_id");
//   const proposalId = searchParams.get("proposalId");

//   const [txData, setTxData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!sessionId || !proposalId) {
//       setError("Payment tokens missing or session context expired.");
//       setLoading(false);
//       return;
//     }

//     const verifyTransaction = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/confirm-session", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ sessionId, proposalId }),
//           credentials: "include" // JWT কুকি সেশন পাস করার জন্য বাধ্যতামূলক
//         });

//         const data = await response.json();
//         if (!response.ok) {
//           throw new Error(data.message || "Stripe validation rejected.");
//         }

//         setTxData(data.data);
//       } catch (err) {
//         console.error("Verification Error:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyTransaction();
//   }, [sessionId, proposalId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center text-white space-y-4">
//         <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-emerald-400 font-medium animate-pulse">Securing transaction parameters & double-checking database vectors...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 text-white">
//       <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6 shadow-2xl relative">
//         <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -z-10" />

//         {error ? (
//           <>
//             <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 text-2xl font-bold">✕</div>
//             <h1 className="text-xl font-bold text-red-400">Verification Engine Offline</h1>
//             <p className="text-gray-400 text-sm">{error}</p>
//             <Button onClick={() => router.push("/dashboard/client")} className="w-full bg-white/5 border border-white/10 text-white rounded-xl">Return to Client Dashboard</Button>
//           </>
//         ) : (
//           <>
//             {/* 🎯 ১. Clear success transaction confirmation message text */}
//             <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl font-bold">✓</div>
//             <div className="space-y-1">
//               <h1 className="text-2xl font-extrabold text-white">Payment Successful!</h1>
//               <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Escrow Ledger Secured</p>
//             </div>

//             <div className="h-px bg-white/10 my-4" />

//             {/* 🎯 ২. Display paid task title, worker name, and price size */}
//             <div className="text-left space-y-4 bg-white/5 border border-white/5 p-5 rounded-xl text-sm">
//               <div>
//                 <p className="text-xs text-gray-500 uppercase tracking-wider">Project Task</p>
//                 <p className="font-bold text-white text-base line-clamp-1 mt-0.5">{txData?.taskTitle}</p>
//               </div>
//               <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase tracking-wider">Hired Worker</p>
//                   <p className="font-semibold text-gray-300 mt-0.5">{txData?.freelancerName}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500 uppercase tracking-wider">Price Size</p>
//                   <p className="font-black text-emerald-400 text-lg mt-0.5">${txData?.amount}</p>
//                 </div>
//               </div>
//             </div>

//             {/* 🎯 ৩. An easy navigation button labeled "Go to Dashboard" */}
//             <Button 
//               onClick={() => router.push("/dashboard/client")} 
//               className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl transition shadow-lg shadow-emerald-600/10"
//             >
//               Go to Dashboard
//             </Button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function PaymentSuccessPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
//         <div className="animate-pulse text-emerald-400">Loading payment module telemetry...</div>
//       </div>
//     }>
//       <SuccessPageContent />
//     </Suspense>
//   );
// }