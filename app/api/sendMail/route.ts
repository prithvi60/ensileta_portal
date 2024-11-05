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
  const { recipientEmail, subject, message } = await req.json();
  if (!recipientEmail) {
    return NextResponse.json(
      { success: false, message: "Recipient email(s) missing" },
      { status: 400 }
    );
  }

  const mailOptions = {
    from: recipientEmail,
    to: process.env.EMAIL_ID,
    subject: subject,
    html: message,
    // bcc: ["john@ensileta.com","design@ensileta.com "],
  };

  // const superAdminMailOptions = {
  //   from: process.env.EMAIL_ID,
  //   to: recipientEmail,
  //   subject: subject,
  //   html: message,
  // bcc: ["john@ensileta.com","design@ensileta.com "],
  // };

  // console.log(mailOptions);

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
