import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // console.log("credentials", credentials);
        if (!credentials) {
          return null;
        }

        // check if the credentials users email id exist
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          if (
            user?.email &&
            (await bcrypt.compare(credentials.password, user.password))
          ) {
            // Generate a JWT token if needed
            const accessToken = jwt.sign(
              { id: user.id, email: user.email },
              JWT_SECRET,
              {
                expiresIn: "1d", // Adjust expiration as needed
              }
            );
            // console.log({
            //   // id: user.id.toString(),
            //   // name: user.username,
            //   // email: user.email,
            //   // accessToken,
            //   role: user.role,
            // });
            return {
              id: user.id.toString(),
              name: user.username,
              email: user.email,
              role: user.role,
              accessToken,
            };
          }
        }

        // check if the credentials users email id exist
        const employeeUser = await prisma.accessControl.findUnique({
          where: { email: credentials.email },
        });

        if (employeeUser) {
          if (
            employeeUser?.email &&
            (await bcrypt.compare(credentials.password, employeeUser.password))
          ) {
            // Generate a JWT token if needed
            const accessToken = jwt.sign(
              { id: employeeUser.id, email: employeeUser.email },
              JWT_SECRET,
              {
                expiresIn: "1d", // Adjust expiration as needed
              }
            );

            // console.log({
            //   role: employeeUser.role,
            // });

            return {
              id: employeeUser.id.toString(),
              email: employeeUser.email,
              role: employeeUser.role,
              accessToken,
            };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: JWT_SECRET,
});

export { handler as GET, handler as POST };
