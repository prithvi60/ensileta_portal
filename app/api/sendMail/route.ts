import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req: Request) {
  const { recipientEmail, subject, message, recipientType } = await req.json();
  if (!recipientEmail || !recipientType) {
    return NextResponse.json(
      { success: false, message: "Recipient email(s) missing" },
      { status: 400 }
    );
  }

  let mailOptions;

  // const mailOptions = {
  //   from: recipientEmail,
  //   to: process.env.EMAIL_ID,
  //   subject: subject,
  //   html: message,
  //   // bcc: ["john@ensileta.com","design@ensileta.com"],
  // };

  if (recipientType === "client") {
    // Email to admin
    mailOptions = {
      from: recipientEmail,
      to: process.env.EMAIL_ID,
      subject: subject,
      html: message,
      // bcc: ["bccclient@example.com"]
    };
  } else if (recipientType === "admin") {
    // Email to client
    mailOptions = {
      from: process.env.EMAIL_ID,
      to: recipientEmail,
      subject: subject,
      html: message,
      // bcc: ["bccclient@example.com"],
    };
  } else {
    return NextResponse.json(
      { success: false, message: "Invalid recipient type" },
      { status: 400 }
    );
  }

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Error sending email" },
      { status: 500 }
    );
  }
}

// please try again later
