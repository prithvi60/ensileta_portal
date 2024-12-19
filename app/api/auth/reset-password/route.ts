import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

// Middleware to add CORS headers
function setCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*"); // Or specify allowed origins
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

// Handle OPTIONS (Preflight) Request
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res);
}

export async function POST(req: Request) {
  const corsHeaders = new NextResponse(null); // Create a response to add headers
  setCorsHeaders(corsHeaders); // Add CORS headers

  try {
    const { password, token } = await req.json();

    const decoded: any = jwt.verify(token, JWT_SECRET!);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return setCorsHeaders(
      NextResponse.json({ message: "Password updated successfully" })
    );
  } catch (error) {
    console.error("Error during password reset:", error);

    return setCorsHeaders(
      NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      )
    );
  }
}

// export async function POST(req: Request) {
//   const { password, token } = await req.json();

//   try {
//     const decoded: any = jwt.verify(token, JWT_SECRET!);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await prisma.users.update({
//       where: { id: decoded.userId },
//       data: { password: hashedPassword },
//     });
//     return NextResponse.json({ message: "Password updated successfully" });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Invalid or expired token" },
//       { status: 400 }
//     );
//   }
// }
