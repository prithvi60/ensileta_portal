import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/lib/TypeDefs";
import { resolvers } from "@/lib/Resolvers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getUserFromToken } from "@/helper/GetUserInfo";

const context = async (req: NextRequest) => {
  try {
    const token = req.headers.get("authorization") || "";
    const user = getUserFromToken(token);

    return {
      userId: user?.id || null,
      prisma,
    };
  } catch (error) {
    console.error("Error creating context:", error);
    return { userId: null, prisma };
  }
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create Next.js handler for Apollo Server
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context,
});

export { handler as GET, handler as POST };
