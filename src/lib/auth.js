import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("skillswap");

export const auth = betterAuth({
  // 🎯 ১. মোস্ট ইম্পর্ট্যান্ট ফিক্স: এটা অবশ্যই তোমার ব্যাকএন্ড সার্ভারের ইউআরএল হবে ভাই!
  // এটি সরাসরি হার্ডকোড করতে পারো অথবা ডাইনামিকালি ড্যাশবোর্ড থেকে রিড করাতে পারো:
  baseURL: process.env.BETTER_AUTH_URL || "https://skillswap-server-one.vercel.app",

  // 🎯 ২. ফ্রন্টএন্ডের লিঙ্কগুলো ট্রাস্টেড অরিজিনে থাকবে (এটি একদম ঠিক আছে)
  trustedOrigins: [
    "https://skillswap-client-virid.vercel.app",
    "https://skillswap-client-1y6fzs8hq-rayhancse8bu-6645s-projects.vercel.app", // 🎯 এই প্রিভিউ লিঙ্কটাও ট্রাস্টেড লিস্টে ঢুকিয়ে দাও ভাই
  ],

  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: "buyer",
      },
      plan: {
        defaultValue: "free",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 60,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [jwt()],
});



// import dns from "node:dns";
// dns.setServers(["1.1.1.1", "1.0.0.1"]);

// import { MongoClient } from "mongodb";
// import { jwt } from "better-auth/plugins";

// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db("skillswap");

// export const auth = betterAuth({
//   baseURL:"https://skillswap-client-virid.vercel.app",
//   trustedOrigins: [
//     "https://skillswap-client-virid.vercel.app",
//     // "http://localhost:3000",
//   ],

//   database: mongodbAdapter(db, {
//     client,
//   }),
//   emailAndPassword: {
//     enabled: true,
//   },
//   user: {
//     additionalFields: {
//       role: {
//         defaultValue: "buyer",
//       },
//       plan: {
//         defaultValue: "free",
//       },
//     },
//   },
//   session: {
//     cookieCache: {
//       enabled: true,
//       strategy: "jwt",
//       maxAge: 60 * 24 * 60,
//     },
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     },
//   },

//   plugins: [jwt()],
// });
