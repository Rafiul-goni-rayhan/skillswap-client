

import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("skillswap");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  // baseURL:"https://skillswap-client-virid.vercel.app",
  trustedOrigins: [
    // "https://skillswap-client-virid.vercel.app",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "https://skillswap-client-virid.vercel.app"
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
        defaultValue: "freelancer",
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
