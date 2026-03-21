// /lib/otp.ts
import nodemailer from "nodemailer";

// OTP generator
export function generateOTP(length = 6): string {
  let otp = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// OTP email sender
export async function sendOTPEmail(email: string, otp: string, username: string) {
  try {
    await transporter.sendMail({
      from: `"Gzone" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Hi ${username}, your OTP is ${otp}. It will expire in 10 minutes.`,
    });
    return true;
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    return false;
  }
}