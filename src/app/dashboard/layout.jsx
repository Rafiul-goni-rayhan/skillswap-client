import DashboardSidebar from "@/components/dashboard/DashboardSidebar";



const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0B0B0F] text-white">
      {/* বামপাশে সাইডবার */}
      <div className="w-64 border-r border-white/10 hidden md:block">
        <DashboardSidebar/>
      </div>
      
      {/* ডানপাশে ডাইনামিক কন্টেন্ট */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;