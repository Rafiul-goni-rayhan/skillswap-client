"use client";

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-8 bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl text-center space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">How SkillSwap Works</h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">Get your micro-tasks completed successfully in three clean, strategic milestones.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: "1", title: "Post a Task", desc: "Clients detail project demands, select a domain category, and allocate budget rules." },
          { step: "2", title: "Get Proposals", desc: "Freelancers browse available listings and submit competitive custom budgets and schedules." },
          { step: "3", title: "Hire & Complete", desc: "Clients accept matching bids, tasks kick-off instantly, and outcomes deliver successfully." }
        ].map((item, idx) => (
          <div key={idx} className="space-y-3 relative p-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              {item.step}
            </div>
            <h4 className="font-bold text-lg text-white pt-2">{item.title}</h4>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}