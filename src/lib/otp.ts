import nodemailer from "nodemailer";

// Generate random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
export async function sendOTPEmail(
  email: string,
  otp: string,
  username: string
): Promise<boolean> {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "GZone - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 10px;">
            <h1 style="color: #10b981; margin: 0;">GZone</h1>
            <p style="color: #9ca3af; margin: 10px 0 0 0;">Quiz Competition Platform</p>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${username}! 👋</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for signing up on GZone. To verify your email and activate your account, please use the OTP below:
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">YOUR VERIFICATION CODE</p>
              <h1 style="color: #10b981; margin: 10px 0; font-size: 48px; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </h1>
            </div>
            
            <p style="color: #4b5563; font-size: 12px; margin: 20px 0;">
              ⏱️ This code will expire in 10 minutes.
            </p>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0;">
              If you didn't sign up for this account, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
              © 2026 GZone. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    return false;
  }
}

// Generate random reset token
export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  username: string
): Promise<boolean> {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "GZone - Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 10px;">
            <h1 style="color: #10b981; margin: 0;">GZone</h1>
            <p style="color: #9ca3af; margin: 10px 0 0 0;">Quiz Competition Platform</p>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password 🔐</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Hi ${username},
            </p>
            
            <p style="color: #4b5563; line-height: 1.6;">
              We received a request to reset your password. Click the button below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #4b5563; font-size: 12px; margin: 20px 0;">
              ⏱️ This link will expire in 1 hour.
            </p>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0;">
              Or copy this link into your browser:
            </p>
            
            <p style="color: #10b981; word-break: break-all; font-size: 12px;">
              ${resetLink}
            </p>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
              © 2026 GZone. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    return false;
  }
}
