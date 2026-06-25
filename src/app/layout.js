"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    // 🎯 স্থায়ীভাবে dark ক্লাস বডি লেভেলে ইনজেক্ট করে দেওয়া হলো
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0B0B0F] text-white`}>
        
        {!isDashboard && <Navbar />}
<Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }} 
        />
        <main>{children}</main>

        {!isDashboard && <Footer />}

      </body>
    </html>
  );
}


// "use client";

// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navbar"; 
// import Footer from "@/components/Footer"; 
// import { usePathname } from "next/navigation";
// import ThemeToggle from "@/components/ThemeToggle";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function RootLayout({ children }) {
//   const pathname = usePathname();

//   const isDashboard = pathname?.startsWith("/dashboard");

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen transition-colors duration-300 bg-slate-50 text-black dark:bg-[#0B0B0F] dark:text-white`}>
//         <NextThemesProvider attribute="class" defaultTheme="dark">
          
//           {/* <ThemeToggle /> */}
          
        
//           {!isDashboard && <Navbar />}

        
//           <main>{children}</main>

      
//           {!isDashboard && <Footer />}

//         </NextThemesProvider>
//       </body>
//     </html>
//   );
// }