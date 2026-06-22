import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ১. লোগো এবং বিবরণ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-500">Skill</span>Swap
            </h2>
            <p className="text-sm text-neutral-400">
              A simpler version of Fiverr or Freelancer.com for fast, one-time jobs. Get your tasks done quickly by skilled freelancers.
            </p>
          </div>

          {/* ২. নেভিগেশন লিংক */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-emerald-400 transition">Home</Link></li>
              <li><Link href="/tasks" className="hover:text-emerald-400 transition">Browse Tasks</Link></li>
              <li><Link href="/freelancers" className="hover:text-emerald-400 transition">Browse Freelancers</Link></li>
            </ul>
          </div>

          {/* ৩. কন্টাক্ট ইনফো */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>Email: info@taskhive.com</li>
              <li>Support: WhatsApp Support</li>
            </ul>
          </div>

          {/* ৪. সোশ্যাল মিডিয়া (নতুন X লোগো) */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {/* নতুন X লোগো (SVG) */}
              <a href="https://x.com" target="_blank" rel="noreferrer" className="bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 text-white transition" aria-label="X">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* অন্যান্য সোশ্যাল মিডিয়া চাইলে দিতে পারেন */}
            </div>
          </div>

        </div>

        {/* ৫. কপিরাইট টেক্সট */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}