import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/db";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;
const imageUrl =
  "https://ik.imagekit.io/webibee/newlogo2.png?updatedAt=1730964119061";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json(
      { message: "Email not registered" },
      { status: 404 }
    );

  const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
    expiresIn: "1h",
  });
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_ID, pass: process.env.EMAIL_PASSWORD },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_ID}>`,
    to: email,
    subject: "Password Reset",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { font-size: 24px; }
        p { margin: 10px 0; }
        .contain { display: inline; color: #65a34e; font-size: 24px;}
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hi Sir/Madam,</h2>
        <p>Greetings from <span class="contain">ENSILETA INTERIORS</span></p>
        <p>Please click <a href="${resetUrl}">here</a> in order to reset your password.</p> 
        <p> This link is active for one hour only, so make sure to use it before it expires.</p>
        <br/>
        <p>Thank You</p>
        <div>
          <img alt="company logo" src="${imageUrl}" />
          <h3>Ensileta Interior</h3>
          <p><strong>Address:</strong> No.77 Old no:43 Second floor, Chamiers Rd, Chennai, Tamil Nadu 600028</p>
          <p><strong>Contact Now:</strong> 9380289546</p>
          <p><strong>Website:</strong> <a href="https://www.ensileta.com" target="_blank">www.ensileta.com</a></p>
        </div>
      </div>
    </body>
    </html>
    `,
  });

  return NextResponse.json({ message: "Reset link sent" });
}
