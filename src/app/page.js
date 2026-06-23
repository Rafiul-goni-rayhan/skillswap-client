"use client";

import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import CategoryList from "@/components/CategoryList";
import FeaturedTasks from "@/components/FeaturedTasks";
import TopFreelancers from "@/components/TopFreelancers";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  const [homeData, setHomeData] = useState({ tasks: [], freelancers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/home-data");
        const data = await response.json();
        if (response.ok) {
          setHomeData(data);
        }
      } catch (err) {
        console.error("Failed to load platform data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white space-y-24 pb-20 overflow-hidden">
      <Hero />
      <CategoryList />
      <FeaturedTasks tasks={homeData.tasks} loading={loading} />
      <TopFreelancers freelancers={homeData.freelancers} loading={loading} />
      <HowItWorks />
    </div>
  );
}