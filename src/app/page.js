
"use client";

import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import CategoryList from "@/components/CategoryList";
import FeaturedTasks from "@/components/FeaturedTasks";
import TopFreelancers from "@/components/TopFreelancers";
import HowItWorks from "@/components/HowItWorks";
import PlatformStatistics from "@/components/PlatformStatistics";

export default function HomePage() {
  const [homeData, setHomeData] = useState({ tasks: [], freelancers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/home-data`);
        
        // 🎯 ১. প্রথম সেফটি চেক: রেসপন্স টাইপ জেসন নাকি এইচটিএমএল তা ভেরিফাই করা
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          console.error("⚠️ [Home Fetch Guard] Backend returned HTML or broken route instead of JSON!");
          setHomeData({ tasks: [], freelancers: [] }); // সেফ ফলব্যাক ডেটা
          setLoading(false);
          return;
        }

        // 🎯 ২. রেসপন্স টাইপ জেসন নিশ্চিত হওয়ার পরই কেবল পার্স করা হবে
        const data = await response.json();
        setHomeData({
          tasks: data?.tasks || [],
          freelancers: data?.freelancers || []
        });

      } catch (err) {
        // 🎯 ৩. নেটওয়ার্ক বা সার্ভার ক্র্যাশ করলেও ফ্রন্টএন্ড আর ব্রেক করবে না
        console.error("🔥 [Home Fetch Crash] Failed to load platform data cleanly:", err);
        setHomeData({ tasks: [], freelancers: [] });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen text-white space-y-24 pb-20 overflow-hidden">
      <Hero />
      <CategoryList />
      <FeaturedTasks tasks={homeData.tasks} loading={loading} />
      <TopFreelancers freelancers={homeData.freelancers} loading={loading} />
      <HowItWorks />
      <PlatformStatistics/>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";

// import Hero from "@/components/Hero";
// import CategoryList from "@/components/CategoryList";
// import FeaturedTasks from "@/components/FeaturedTasks";
// import TopFreelancers from "@/components/TopFreelancers";
// import HowItWorks from "@/components/HowItWorks";
// import PlatformStatistics from "@/components/PlatformStatistics";

// export default function HomePage() {
//   const [homeData, setHomeData] = useState({ tasks: [], freelancers: [] });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHomeData = async () => {
//       try {
//         const response = await fetch("${process.env.NEXT_PUBLIC_SERVER_URL}/api/home-data");
//         const data = await response.json();
//         if (response.ok) {
//           setHomeData(data);
//         }
//       } catch (err) {
//         console.error("Failed to load platform data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHomeData();
//   }, []);

//   return (
//     <div className="min-h-screen  text-white space-y-24 pb-20 overflow-hidden">
//       <Hero />
//       <CategoryList />
//       <FeaturedTasks tasks={homeData.tasks} loading={loading} />
//       <TopFreelancers freelancers={homeData.freelancers} loading={loading} />
//       <HowItWorks />
//       <PlatformStatistics/>
//     </div>
//   );
// }