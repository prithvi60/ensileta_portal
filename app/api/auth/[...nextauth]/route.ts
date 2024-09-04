import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log(credentials);

        if (!credentials) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        // console.log("User password:", user?.password);
        // console.log("Provided password:", credentials.password);
        if (
          user?.email &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
          };
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
  // callbacks: {
  //   async session({ session, token }) {
  //     if (token) {
  //       session.user = token;
  //     }
  //     return session;
  //   },
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.email = user.email;
  //     }
  //     return token;
  //   },
  // },
});

export { handler as GET, handler as POST };
