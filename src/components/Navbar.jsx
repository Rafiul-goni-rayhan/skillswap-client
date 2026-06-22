import Link from 'next/link';

export default function Navbar() {
  // সাময়িকভাবে আমরা ধরে নিচ্ছি ইউজার লগইন করা নেই এবং তার রোল 'client' বা 'freelancer'
  // পরবর্তীতে BetterAuth এবং JWT সেটআপ করলে এই স্টেটগুলো ডাইনামিক হবে।
  const user = null; // লগইন চেক করার জন্য (null মানে logged out)
  const userRole = 'client'; // 'client', 'freelancer', অথবা 'admin'

  return (
    <nav className="bg-neutral-950 text-white border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ওয়েবসাইট লোগো ও নাম (Section 04) */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wider">
              <span className="text-emerald-500">Skill</span>Swap
            </Link>
          </div>

          {/* নেভিগেশন লিংকস (Section 04) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* --- Public Links (সবার জন্য) --- */}
            <Link href="/" className="hover:text-emerald-400 transition text-sm font-medium">Home</Link>
            <Link href="/tasks" className="hover:text-emerald-400 transition text-sm font-medium">Browse Tasks</Link>
            <Link href="/freelancers" className="hover:text-emerald-400 transition text-sm font-medium">Browse Freelancers</Link>

            {/* --- Private Links (শুধু লগইন করা ইউজারদের জন্য) --- */}
            {user && (
              <>
                <Link 
                  href={`/dashboard/${userRole}`} 
                  className="hover:text-emerald-400 transition text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link href="/profile" className="hover:text-emerald-400 transition text-sm font-medium">Profile</Link>
              </>
            )}
          </div>

          {/* লগইন / লগআউট বাটন সেকশন */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <Link 
                href="/login" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
            ) : (
              <button 
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* মোবাইল মেনু বাটন (রেসপন্সিভ লেআউট নিশ্চিত করতে) */}
          <div className="md:hidden">
            <button className="text-neutral-400 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}