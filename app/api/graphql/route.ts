import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/lib/TypeDefs";
import { resolvers } from "@/lib/Resolvers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getUserFromToken } from "@/helper/GetUserInfo";

const allowedOrigins = [
  "https://ensileta-hub.webibee.com",
  "https://designhub.ensileta.com",
];

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

// Create Next.js handler for Apollo Server with CORS headers
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context,
});

// Middleware to add CORS headers
const corsMiddleware = async (req: NextRequest) => {
  const origin = req.headers.get("origin") || "";

  // Handle Apollo server response
  const res = await handler(req);

  // Clone response to modify headers
  const modifiedRes = new NextResponse(res.body, res);

  // Add CORS headers if origin is allowed
  if (allowedOrigins.includes(origin)) {
    modifiedRes.headers.set("Access-Control-Allow-Origin", origin);
  }

  modifiedRes.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  modifiedRes.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return modifiedRes;
};

// Handle Preflight OPTIONS requests
export const OPTIONS = async (req: NextRequest) => {
  const origin = req.headers.get("origin") || "";

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return new NextResponse(null, { headers });
};

export const GET = corsMiddleware;
export const POST = corsMiddleware;
