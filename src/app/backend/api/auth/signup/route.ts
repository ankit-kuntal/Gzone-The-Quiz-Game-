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

    // Create user with OTP (not verified yet)
    const user = await User.create({
      username,
      email,
      password,
      otp,
      otpExpiry,
      isEmailVerified: false,
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, username);

    if (!emailSent) {
      // If email fails, still return success but warn user
      console.warn(`⚠️ OTP email failed to send for ${email}, but user created`);
    }

    // Return pending verification status
    const response = NextResponse.json(
      {
        success: true,
        message: "Account created! OTP sent to your email.",
        email: user.email,
        requiresVerification: true,
      },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Signup Error ⇒", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
