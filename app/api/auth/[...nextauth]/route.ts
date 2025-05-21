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
      id: string;
      name?: string;
      email: string;
      role?: string;
      authMethod?: "password" | "otp";
    };
    accessToken?: string;
  }
  interface User {
    id: string;
    email: string;
    role?: string;
    authMethod?: "password" | "otp";
    accessToken?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role?: string;
    authMethod?: "password" | "otp";
    accessToken?: string;
  }
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

const generateToken = (user: { id: string; email: string; role?: string }) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "",
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// const authenticateUser = async (email: string, password: string) => {
//   // Check user in 'users' table
//   const user = await prisma.users.findUnique({ where: { email } });

//   if (user && (await bcrypt.compare(password, user.password))) {
//     return {
//       id: user.id.toString(),
//       name: user.username,
//       email: user.email,
//       role: user.role || "",
//       accessToken: generateToken({
//         id: user.id,
//         email: user.email,
//         role: user.role || "",
//       }),
//     };
//   }

//   // Check user in 'accessControl' table
//   const employeeUser = await prisma.accessControl.findUnique({
//     where: { email },
//   });

//   if (employeeUser && (await bcrypt.compare(password, employeeUser.password))) {
//     return {
//       id: employeeUser.id.toString(),
//       email: employeeUser.email,
//       role: employeeUser.role || "",
//       accessToken: generateToken({
//         id: employeeUser.id,
//         email: employeeUser.email,
//         role: employeeUser.role,
//       }),
//     };
//   }

//   return null;
// };

const authenticateUser = async (
  email: string,
  credential: string,
  method: "password" | "otp"
) => {
  // Find user by email only
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      role: true,
    },
  });

  // Check user in 'accessControl' table
  const employeeUser = await prisma.accessControl.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!user && !employeeUser) return null;

  if (method === "password") {
    // Password authentication

    if (user?.password && (await bcrypt.compare(credential, user.password))) {
      return {
        id: user.id.toString(),
        name: user.username,
        email: user.email,
        role: user.role || "",
        authMethod: "password" as const,
        accessToken: generateToken({
          id: user.id.toString(),
          email: user.email,
          role: user.role || "",
        }),
      };
    }

    if (
      employeeUser?.password &&
      (await bcrypt.compare(credential, employeeUser.password))
    ) {
      console.log("employeeUser");

      return {
        id: employeeUser.id.toString(),
        email: employeeUser.email,
        role: employeeUser.role || "",
        accessToken: generateToken({
          id: employeeUser.id.toString(),
          email: employeeUser.email,
          role: employeeUser.role,
        }),
      };
    }
  } else if (method === "otp") {
    // OTP authentication
    const otpRecord = await prisma.otp.findFirst({
      where: { email: user?.email || employeeUser?.email },
      orderBy: { createdAt: "desc" },
    });
    console.log(otpRecord);

    if (!otpRecord || otpRecord.otp !== credential) return null;
    if (otpRecord.verified) return null;
    if (new Date() > otpRecord.expiresAt) return null;

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    if (user) {
      return {
        id: user.id.toString(),
        name: user.username,
        email: user.email,
        role: user.role || "",
        authMethod: "otp" as const,
        accessToken: generateToken({
          id: user.id.toString(),
          email: user.email,
          role: user.role || "",
        }),
      };
    }

    if (employeeUser) {
      console.log("employeeUser2");
      return {
        id: employeeUser.id.toString(),
        name: employeeUser.username,
        email: employeeUser.email,
        role: employeeUser.role || "",
        authMethod: "otp" as const,
        accessToken: generateToken({
          id: employeeUser.id.toString(),
          email: employeeUser.email,
          role: employeeUser.role || "",
        }),
      };
    }
  }

  return null;
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        credential: { label: "Password/OTP", type: "password" },
        method: { label: "Method", type: "text" },
      },
      authorize: async (credentials) => {
        if (
          !credentials?.email ||
          !credentials?.credential ||
          !credentials?.method
        ) {
          throw new Error("Missing required credentials");
        }

        if (!["password", "otp"].includes(credentials.method)) {
          throw new Error("Invalid authentication method");
        }

        const user = await authenticateUser(
          credentials.email,
          credentials.credential,
          credentials.method as "password" | "otp"
        );

        if (!user) {
          throw new Error(
            credentials.method === "password"
              ? "Invalid email or password"
              : "Invalid email or OTP"
          );
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.authMethod = user.authMethod;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.authMethod = token.authMethod;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: JWT_SECRET,
});

export { handler as GET, handler as POST };
