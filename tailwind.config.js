/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🎯 ডার্ক মোড যেন ক্লাসের ওপর বেস করে চলে
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

// let heroui;
// try {
//   heroui = require("@heroui/react").heroui;
// } catch (e) {
//   heroui = () => []; // সেফ ফলব্যাক
// }

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // 🎯 এই লাইনটি অবশ্যই যোগ করো (এটিই ক্লাস ট্র্যাক করে থিম সুইচ করায়)
//   darkMode: "class", 
  
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}" // HeroUI পাথ
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [heroui()],
// };