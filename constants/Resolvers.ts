import { prisma } from "@/prisma/db";

export const resolvers = {
  Query: {
    users: async () => {
      const userData = await prisma.users.findMany();
      console.log(userData);
      return userData;
    },
    user: async (_: unknown, { id }: { id: number }) => {
      const user = await prisma.users.findUnique({
        where: { id },
      });
      return user;
    },
  },
  // Mutation: {
  // },
};
