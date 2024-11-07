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
    return NextResponse.json(
      { success: false, message: "Recipient email(s) missing" },
      { status: 400 }
    );
  }

  let mailOptions;
  let notifyMailOptions;

  if (recipientType === "client") {
    mailOptions = {
      from: recipientEmail,
      to: process.env.EMAIL_ID,
      subject: subject1,
      html: message1,
      bcc: ["gokulgandhi2301@gmail.com"],
    };
    if (message2 && employeeId) {
      notifyMailOptions = {
        from: process.env.EMAIL_ID,
        to: employeeId,
        subject: subject2,
        html: generateEmailTemplate(message2),
        bcc: ["gokulgandhi2301@gmail.com"],
      };
    }
  } else if (recipientType === "admin") {
    if (message3) {
      mailOptions = {
        from: process.env.EMAIL_ID,
        to: recipientEmail,
        subject: subject3,
        html: generateEmailTemplate(message3),
        bcc: ["gokulgandhi2301@gmail.com"],
      };
    }
    // if (message4) {
    //   notifyMailOptions = {
    //     from: process.env.EMAIL_ID,
    //     to: employeeId,
    //     subject: subject4,
    //     html: generateEmailTemplate(message4),
    //   };
    // }
  } else {
    return NextResponse.json(
      { success: false, message: "Invalid recipient type" },
      { status: 400 }
    );
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
