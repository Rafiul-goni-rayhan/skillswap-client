import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("skillswap");

export const auth = betterAuth({
  baseURL:"https://skillswap-client-virid.vercel.app",
  trustedOrigins: [
    "https://skillswap-client-virid.vercel.app",
    "http://localhost:3000",
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
  plugins: [jwt()],
});
