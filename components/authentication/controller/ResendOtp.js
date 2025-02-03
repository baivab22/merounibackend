import UserModel from "../../users/model/UserModel.js";

export const resendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user by email
      const user = await UserModel.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Optional: Prevent frequent OTP requests (e.g., 5-minute cooldown)
      const now = new Date();
      if (user.otpExpiresAt && now - user.otpExpiresAt < 5 * 60 * 1000) {
        return res.status(429).json({ message: "Please wait before requesting a new OTP." });
      }
  
      // Generate a new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
      const otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 min expiry
  
      // Update OTP in database
      await UserModel.update({ otp: newOtp, otpExpiresAt }, { where: { email } });
  
      // Send the new OTP via email (implement email sending logic)
      console.log(`New OTP for ${email}: ${newOtp}`);
  
      return res.status(200).json({ message: "New OTP sent successfully." });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
  };
  