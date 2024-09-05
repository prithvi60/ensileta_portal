import NextAuth, { Session } from "next-auth";

// Extend the default session interface
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
