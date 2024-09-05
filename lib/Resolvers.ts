import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLResolveInfo } from "graphql";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

export const resolvers = {
  Query: {
    users: async () => {
      const userData = await prisma.users.findMany();
      console.log(userData);
      return userData;
    },
    userProfile: async (
      _parent: any,
      _args: any,
      _context: any,
      _info: GraphQLResolveInfo
    ) => {
      const userId = _context.userId;
      console.log(userId);

      if (!userId) {
        throw new Error("Not authenticated");
      }
      // Fetch user data from the database
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }
      return {
        username: user.username,
        email: user.email,
        id: user.id,
      };
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      { username, email, password, confirmPassword }: any
    ) => {
      if (password !== confirmPassword) {
        throw new Error("Password do not match, Please check the password");
      }

      const hashedPwd = await bcrypt.hash(password, 10);
      try {
        const userData = await prisma.users.create({
          data: {
            username,
            email,
            password: hashedPwd,
          },
        });
        return userData;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Invalid Email");
        }

        const pwd = await bcrypt.compare(password, user.password);

        if (!pwd) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { id: user.id.toString(), email: user.email },
          JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        console.log(token, user);

        // return token;
        return {
          ...user,
          token,
        };
      } catch (error) {
        console.error("Error logging in user:", error);
        throw new Error("Failed to log in");
      }
    },
  },
};
