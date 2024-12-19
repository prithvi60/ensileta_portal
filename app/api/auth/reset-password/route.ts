import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(req: Request) {
  const { password, token } = await req.json();

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET!);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
