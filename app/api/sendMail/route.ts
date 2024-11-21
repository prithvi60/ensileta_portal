import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { generateEmailTemplate } from "@/helper/EmailTemplate";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
  const res = new NextResponse(null);
  return setCorsHeaders(res);
}

export async function POST(req: Request) {
  const {
    recipientEmail,
    subject1,
    subject2,
    subject3,
    message1,
    message2,
    message3,
    recipientType,
    employeeId,
  } = await req.json();

  if (!recipientEmail || !recipientType) {
    const res = NextResponse.json(
      { success: false, message: "Recipient email(s) missing" },
      { status: 400 }
    );
    return setCorsHeaders(res);
  }

  let mailOptions;
  let notifyMailOptions;

  if (recipientType === "client") {
    mailOptions = {
      from: recipientEmail,
      to: process.env.EMAIL_ID,
      subject: subject1,
      html: message1,
      // bcc: [""],
    };
    if (message2 && employeeId) {
      notifyMailOptions = {
        from: process.env.EMAIL_ID,
        to: employeeId,
        subject: subject2,
        html: generateEmailTemplate(message2),
        // bcc: [""],
      };
    }
  } else if (recipientType === "admin") {
    if (message3) {
      mailOptions = {
        from: process.env.EMAIL_ID,
        to: recipientEmail,
        subject: subject3,
        html: generateEmailTemplate(message3),
        // bcc: [""],
      };
    }
  } else {
    const res = NextResponse.json(
      { success: false, message: "Invalid recipient type" },
      { status: 400 }
    );
    return setCorsHeaders(res);
  }

  try {
    // Send the main email if mailOptions is defined
    if (mailOptions) {
      await transporter.sendMail(mailOptions);
    }

    // Send notification email to the employee if notifyMailOptions is defined
    if (notifyMailOptions) {
      await transporter.sendMail(notifyMailOptions);
    }

    const res = NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
    return setCorsHeaders(res);
  } catch (error) {
    console.error("Error sending email:", error);
    const res = NextResponse.json(
      { success: false, message: "Error sending email" },
      { status: 500 }
    );
    return setCorsHeaders(res);
  }
}
