import nodemailer from "nodemailer";
import { generateOtpEmailTemplate } from "./EmailTemplate";

export async function sendOtpEmail(
  email: string,
  otp: string,
  expiryTime: string
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailContent = generateOtpEmailTemplate(otp, expiryTime);

  await transporter.sendMail({
    from: 'Ensileta Interiors <support@webibee.com>',
    to: email,
    subject: "Your Ensileta Interiors Account Login OTP",
    html: emailContent,
  });
}
