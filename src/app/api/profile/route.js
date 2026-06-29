import { auth } from "../auth/[...nextauth]/route";
import { connectDB } from "../../../lib/mongodb";
import { Member } from "../../../models/Member";
import { Otp } from "../../../models/Otp";
import { sendOtpEmail } from "../../../lib/emailService";

export async function POST(request) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const { action, name, newEmail, code } = body;

    // Fetch the current member from DB
    const member = await Member.findOne({ email: session.user.email });
    if (!member) {
      return Response.json({ error: "User not found" }, { status: 444 });
    }

    if (action === "update-name") {
      if (!name || name.trim() === "") {
        return Response.json({ error: "Name is required" }, { status: 400 });
      }

      member.name = name.trim();
      await member.save();

      return Response.json({
        success: true,
        message: "Profile name updated successfully",
        user: { name: member.name, email: member.email },
      });
    }

    if (action === "send-otp") {
      if (!newEmail || newEmail.trim() === "") {
        return Response.json({ error: "New email is required" }, { status: 400 });
      }

      const emailLower = newEmail.trim().toLowerCase();

      // Check if new email is already in use
      const existing = await Member.findOne({ email: emailLower });
      if (existing && existing.email !== member.email) {
        return Response.json({ error: "Email is already in use by another account" }, { status: 400 });
      }

      // Generate 6 digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to DB (upsert if exists)
      await Otp.findOneAndUpdate(
        { email: emailLower },
        { code: otpCode, createdAt: new Date() },
        { upsert: true, new: true }
      );

      // Send the OTP email
      await sendOtpEmail({ to: emailLower, otp: otpCode });

      return Response.json({
        success: true,
        message: `Verification code sent to ${emailLower}`,
      });
    }

    if (action === "verify-email") {
      if (!newEmail || !code) {
        return Response.json({ error: "New email and code are required" }, { status: 400 });
      }

      const emailLower = newEmail.trim().toLowerCase();
      const codeStr = code.trim();

      // Verify OTP code
      const otpDoc = await Otp.findOne({ email: emailLower });
      if (!otpDoc || otpDoc.code !== codeStr) {
        return Response.json({ error: "Invalid or expired verification code" }, { status: 400 });
      }

      // Delete the OTP document
      await Otp.deleteOne({ _id: otpDoc._id });

      // Update Member email in DB
      member.email = emailLower;
      await member.save();

      return Response.json({
        success: true,
        message: "Email updated successfully",
        user: { name: member.name, email: member.email },
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in profile update route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
