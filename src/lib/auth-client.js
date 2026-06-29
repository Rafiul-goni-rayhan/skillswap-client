import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: "https://skillswap-client-virid.vercel.app",
  baseURL: process.env.BETTER_AUTH_URL,
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



