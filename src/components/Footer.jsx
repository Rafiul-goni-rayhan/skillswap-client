"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  // 🎯 কপিরাইট ইয়ার রুল: ডাইনামিক কারেন্ট ইয়ার জেনারেট করা
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0E0E12] border-t border-white/10 text-gray-400 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 🏢 ১. Website Logo with name & Contact Info */}
        <div className="space-y-4">
          <Link href="/" className="text-xl font-black tracking-wider bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent block">
            SkillSwap
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed">
            The next-generation dynamic marketplace matrix empowering global developers and clients.
          </p>
          {/* 📬 Email or contact info rule */}
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">Contact Us:</p>
            <p className="hover:text-emerald-400 transition-colors">support@skillswap.com</p>
            <p className="text-gray-500">+880 1234-567890</p>
          </div>
        </div>

        {/* 🔗 ২. Navigation links to main pages (Platform Overview) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Marketplace Feed</Link></li>
            <li><Link href="/dashboard/freelancers" className="hover:text-white transition-colors">Browse Freelancers</Link></li>
            <li><Link href="/tasks" className="hover:text-white transition-colors">Explore Tasks</Link></li>
          </ul>
        </div>

        {/* 💡 ৩. Navigation links to main pages (Company/Legal) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="hover:text-white transition-colors">About Venture</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocols</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Node</Link></li>
          </ul>
        </div>

        {/* 🌐 ৪. Social media links (With New X Icon) */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Connect Vectors</h4>
          <div className="flex space-x-4">
            
            {/* 🎯 New X Icon Rule (Custom SVG mapping the new branding architecture) */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center rounded-xl transition border border-white/10" title="Follow on X">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center rounded-xl transition border border-white/10" title="GitHub Profile">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.35-2.2-.25-4.52-1.11-4.52-4.92 0-1.08.38-1.97 1.03-2.67-.1-.26-.45-1.27.1-2.64 0 0 .83-.27 2.74 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.74-1.02 2.74-1.02.55 1.37.2 2.38.1 2.64.65.7 1.03 1.58 1.03 2.67 0 3.82-2.33 4.66-4.53 4.91.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center rounded-xl transition border border-white/10" title="LinkedIn Connection">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

          </div>
        </div>

      </div>

      {/* 📜 নিচের পার্ট: Copyright Text */}
      <div className="max-w-6xl mx-auto px-6 border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
        {/* Copyright year rule implementation */}
        <p>© {currentYear} SkillSwap Network Ltd. All secure ledger rights reserved.</p>
        <p className="tracking-wide">Engineered by <span className="text-emerald-400 font-semibold">Rayhan</span></p>
      </div>
    </footer>
  );
}