"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BrowseTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ফিল্টার ও পেজিনেশন স্টেটস (Challenge 1 & 3)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["All", "Design", "Writing", "Development", "Marketing", "Other"];

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // ব্যাকএন্ড এপিআই তে সার্চ, ফিল্টার এবং পেজ পাঠানো হচ্ছে
        const url = `https://skillswap-server-one.vercel.app/api/tasks?page=${currentPage}&limit=9&search=${search}&category=${category}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks.");
        }

        setTasks(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentPage, search, category]); // এই ৩টির যেকোনো একটি চেঞ্জ হলে অটো ফেচ হবে

  // সার্চ বা ক্যাটাগরি চেঞ্জ হলে পেজ ১ এ রিসেট করা (Challenge 3 Rule)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার সেকশন */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Browse Available Tasks
          </h1>
          <p className="text-gray-400 text-lg">
            Explore exciting projects posted by clients and start bidding today.
          </p>
        </div>

        {/* 🔍 CHALLENGE 1: সার্চ ও ফিল্টারিং প্যানেল */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
          {/* টাইটেল সার্চ ইনপুট */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          {/* ক্যাটাগরি ড্রপডাউন */}
          <div>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full bg-[#0B0B0F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* লোডিং স্টেট */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white/5 border border-white/10 h-60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* কোনো টাস্ক না থাকলে */}
        {!loading && tasks.length === 0 && !error && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-400 text-lg">No tasks found matching your criteria.</p>
          </div>
        )}

        {/* ডাইনামিক টাস্ক কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && tasks.map((task) => (
            <div 
              key={task._id} 
              className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-xl shadow-xl hover:border-emerald-500/40 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-xl font-bold text-white line-clamp-1">{task.title}</h2>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                    {task.category || "General"}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                  {task.description}
                </p>

                {/* Client Email Info */}
                <p className="text-xs text-gray-500">
                  By: <span className="text-gray-400">{task.client_email}</span>
                </p>
              </div>

              {/* বাজেট ও ডেডলাইন */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Budget</p>
                  <p className="text-xl font-bold text-emerald-400">${task.budget}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Deadline</p>
                  <p className="text-sm font-medium text-gray-300">
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ভিউ ডিটেইলস নেটিভ লিংক */}
              <Link 
                href={`/tasks/${task._id}`}
                className="w-full mt-4 block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md"
              >
                View Details & Bid
              </Link>
            </div>
          ))}
        </div>

        {/* 🔢 CHALLENGE 3: সার্ভার-সাইড পেজিনেশন কন্ট্রোলস */}
        {!loading && tasks.length > 0 && (
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-emerald-500 rounded-xl font-medium transition disabled:opacity-30 disabled:hover:border-white/10"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400 font-medium">
              Page <span className="text-white">{currentPage}</span> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-emerald-500 rounded-xl font-medium transition disabled:opacity-30 disabled:hover:border-white/10"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@heroui/react";
// import Link from "next/link";

// export default function BrowseTasksPage() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await fetch("https://skillswap-server-one.vercel.app/api/tasks");
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || "Failed to fetch tasks.");
//         }

//         setTasks(data.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0B0B0F] text-white p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* হেডার সেকশন */}
//         <div className="text-center md:text-left space-y-2">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
//             Browse Available Tasks
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Explore exciting projects posted by clients and start bidding today.
//           </p>
//         </div>

//         {/* লোডিং স্টেট */}
//         {loading && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((n) => (
//               <div key={n} className="bg-white/5 border border-white/10 h-60 rounded-2xl animate-pulse"></div>
//             ))}
//           </div>
//         )}

//         {error && (
//           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
//             {error}
//           </div>
//         )}

//         {/* কোনো টাস্ক না থাকলে */}
//         {!loading && tasks.length === 0 && !error && (
//           <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
//             <p className="text-gray-400 text-lg">No tasks posted yet. Check back later!</p>
//           </div>
//         )}

//         {/* ডাইনামিক টাস্ক কার্ড গ্রিড */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tasks.map((task) => (
//             <div 
//               key={task._id} 
//               className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-xl shadow-xl hover:border-emerald-500/40 transition-all duration-300"
//             >
//               <div className="space-y-4">
//                 <div className="flex justify-between items-start gap-2">
//                   <h2 className="text-xl font-bold text-white line-clamp-1">{task.title}</h2>
//                   <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
//                     {task.status}
//                   </span>
//                 </div>
                
//                 <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
//                   {task.description}
//                 </p>

//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-1.5">
//                   {task.tags?.map((tag, index) => (
//                     <span 
//                       key={index} 
//                       className="bg-white/5 border border-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-lg"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* বাজেট ও ডেডলাইন */}
//               <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase tracking-wider">Budget</p>
//                   <p className="text-xl font-bold text-emerald-400">${task.budget}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500 uppercase tracking-wider">Deadline</p>
//                   <p className="text-sm font-medium text-gray-300">
//                     {new Date(task.deadline).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric"
//                     })}
//                   </p>
//                 </div>
//               </div>

//               {/* ফিক্সড করা ভিউ ডিটেইলস বাটন */}
//               <Link 
//   href={`/tasks/${task._id}`}
//   className="w-full mt-4 block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20"
// >
//   View Details & Bid
// </Link>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }