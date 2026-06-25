// import { jwtClient } from "better-auth/client/plugins";
// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   // 🎯 ডাইনামিক বেস ইউআরএল: লোকালহোস্টে থাকলে ৫০০০ পোর্ট, আর প্রোডাকশনে থাকলে লাইভ ব্যাকএন্ড লিঙ্ক রিড করবে ভাই
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:5000",
//   plugins: [jwtClient()],
// });

// export const { signIn, signUp, useSession } = authClient;



import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "https://skillswap-client-virid.vercel.app",
  plugins: [jwtClient()],
});
export const { signIn, signUp, useSession } = authClient



