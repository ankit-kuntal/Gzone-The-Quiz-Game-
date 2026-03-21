import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/model/User";
import { generateOTP, sendOTPEmail } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // ✅ Send OTP first
    const emailSent = await sendOTPEmail(email, otp, username);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    // ✅ Only create user after OTP email sent successfully
    const user = await User.create({
      username,
      email,
      password,
      otp,
      otpExpiry,
      isEmailVerified: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created! OTP sent to your email.",
        email: user.email,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error ⇒", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}