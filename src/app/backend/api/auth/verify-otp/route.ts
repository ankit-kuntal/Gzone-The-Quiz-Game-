import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/model/User";
import { signToken } from "@/lib/jwt";
import { generateOTP, sendOTPEmail } from "@/lib/otp";

// ------------------- VERIFY OTP -------------------
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.isEmailVerified) return NextResponse.json({ error: "Email already verified" }, { status: 400 });

    if (!user.otpExpiry || new Date() > user.otpExpiry)
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });

    if (user.otp !== otp) return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });

    // OTP correct → mark verified
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT
    const token = signToken({ id: user._id.toString(), username: user.username, email: user.email });

    // Response with JWT cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Email verified successfully!",
        token,
        username: user.username,
        email: user.email,
        redirect: "/" // <-- frontend can read this and redirect
      },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 });

    return response;
  } catch (error) {
    console.error("OTP Verification Error ⇒", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ------------------- RESEND OTP -------------------
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.isEmailVerified) return NextResponse.json({ error: "Email already verified" }, { status: 400 });

    // Generate new OTP
    const newOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = newOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    const emailSent = await sendOTPEmail(email, newOTP, user.username);
    if (!emailSent) return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });

    return NextResponse.json({ success: true, message: "New OTP sent to your email" }, { status: 200 });
  } catch (error) {
    console.error("Resend OTP Error ⇒", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}