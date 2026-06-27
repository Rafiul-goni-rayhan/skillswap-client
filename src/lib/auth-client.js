import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // 🎯 মোস্ট ইম্পর্ট্যান্ট ফিক্স: এখানে অবশ্যই তোমার এক্সপ্রেস ব্যাকঅ্যান্ডের লিঙ্ক হবে ভাই!
  baseURL: "https://skillswap-client-virid.vercel.app",
  plugins: [jwtClient()],
});

export const { signIn, signUp, useSession } = authClient;


// import { jwtClient } from "better-auth/client/plugins";
// import { createAuthClient } from "better-auth/react";
// export const authClient = createAuthClient({
//   baseURL: "https://skillswap-client-virid.vercel.app",
//   // baseURL: "http://localhost:3000",
//   plugins: [jwtClient()],
// });
// export const { signIn, signUp, useSession } = authClient



