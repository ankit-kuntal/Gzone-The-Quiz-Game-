import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import User from "@/models/User";
import bcryptjs from "bcryptjs";
// import { signToken } from "@/lib/jwt";

// export async function POST(request: NextRequest) {
//   try {
//     await connectToDatabase();

//     const { email, password } = await request.json();

//     // Login using username OR email
//     const user = await User.findOne({
//       $or: [{ email }, { username: email }],
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 400 }
//       );
//     }

//     // Check if email is verified
//     if (!user.isEmailVerified) {
//       return NextResponse.json(
//         {
//           error: "Please verify your email before logging in",
//           requiresVerification: true,
//           email: user.email,
//         },
//         { status: 403 }
//       );
//     }

//     const isPasswordMatch = await bcryptjs.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json(
//         { error: "Invalid Password" },
//         { status: 400 }
//       );
//     }

//     const tokenData = {
//       id: user._id.toString(),
//       username: user.username,
//       email: user.email,
//     };

//     const token = signToken(tokenData);

//     const response = NextResponse.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id.toString(),
//         username: user.username,
//         email: user.email,
//       },
//     });

//     // Set token in both cookie and return it for localStorage
//     response.cookies.set("token", token, {
//       httpOnly: true,
//       path: "/",
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     return response;
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }
