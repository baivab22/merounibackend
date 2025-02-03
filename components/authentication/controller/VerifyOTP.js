import UserModel from "../../users/model/UserModel.js";

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`Stored OTP: ${user.otp}, Entered OTP: ${otp}`);
    console.log(
      `Stored Expiry: ${user.otpExpiresAt}, Current Time: ${new Date()}`
    );

    // Validate OTP
    if (!user.otp) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new OTP." });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiresAt) {
      return res
        .status(400)
        .json({ message: "Expired OTP. Request a new one." });
    }

    // Update user's roles (Activating "student" role)
    let updatedRoles =
      typeof user.roles === "string" ? JSON.parse(user.roles) : user.roles;
    updatedRoles.student = true;
    // Clear OTP after successful verification
    await UserModel.update(
      { roles: updatedRoles, otp: null, otpExpiresAt: null },
      { where: { email } }
    );

    return res
      .status(200)
      .json({ message: "OTP verified successfully. Role updated!" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
