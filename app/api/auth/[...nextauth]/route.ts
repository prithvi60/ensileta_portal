import NextAuth, { Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/db";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
// Extend the interface
declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // Add role property
      name?:string
    };
  }
  interface User {
    role?: string; // Add role property
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Add role property
  }
}
const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

const generateToken = (user: { id: number; email: string; role?: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || "" },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const authenticateUser = async (email: string, password: string) => {
  // Check user in 'users' table
  const user = await prisma.users.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      id: user.id.toString(),
      name: user.username,
      email: user.email,
      role: user.role || "",
      accessToken: generateToken({
        id: user.id,
        email: user.email,
        role: user.role || "",
      }),
    };
  }

  // Check user in 'accessControl' table
  const employeeUser = await prisma.accessControl.findUnique({
    where: { email },
  });

  if (employeeUser && (await bcrypt.compare(password, employeeUser.password))) {
    return {
      id: employeeUser.id.toString(),
      email: employeeUser.email,
      role: employeeUser.role || "",
      accessToken: generateToken({
        id: employeeUser.id,
        email: employeeUser.email,
        role: employeeUser.role,
      }),
    };
  }

  return null;
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await authenticateUser(
          credentials.email,
          credentials.password
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }:{user:User,token:JWT}) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }:{session:Session,token:JWT}) {
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: JWT_SECRET,
});

export { handler as GET, handler as POST };
