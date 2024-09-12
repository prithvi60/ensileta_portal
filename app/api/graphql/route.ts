import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/lib/TypeDefs";
import { resolvers } from "@/lib/Resolvers";
import { NextRequest } from "next/server";
import prisma from "@/prisma/db";
import { getUserFromToken } from "@/helper/GetUserInfo";

const context = async (req: NextRequest) => {
  const token = req.headers.get("authorization") || "";
  const user = getUserFromToken(token);
  console.log("context", user);

  return {
    userId: user?.id,
    prisma,
  };
};

// Initialize Apollo Server with the typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create the Next.js handler for Apollo Server
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context,
});

export { handler as GET, handler as POST };
