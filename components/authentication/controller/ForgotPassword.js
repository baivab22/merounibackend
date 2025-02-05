import bcrypt from "bcrypt";
import UserModel from "../../users/model/UserModel.js";
import { sendMail } from "../../../middleware/MainHelper.js";
import crypto from "crypto";

const otpStore = new Map();

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in memory (Use database for production)
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Expires in 5 min

    // Send OTP via email
    await sendMail(
      email,
      "Password Reset OTP",
      `Your OTP is: ${otp}`,
      `<p>Your OTP is: <strong>${otp}</strong></p>`
    );

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * Verify OTP and Reset Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password: newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Retrieve OTP from store
    const storedOtpData = otpStore.get(email);

    if (!storedOtpData || storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Delete OTP after verification
    otpStore.delete(email);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await UserModel.update({ password: hashedPassword }, { where: { email } });

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
