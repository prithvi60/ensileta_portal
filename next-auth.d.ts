import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add accessToken to the session type
  }

  interface User {
    accessToken?: string; // Add accessToken to the user type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string; // Add accessToken to the JWT type
  }
}
