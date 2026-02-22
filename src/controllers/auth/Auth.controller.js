import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  loginHelper,
  forgotPasswordHelper,
  resetPasswordHelper,
} from "../../validators/authentication/Auth.validator.js";
import { sendMail } from "../../utils/Mail.util.js";
import AuthService from "../../services/auth/Auth.service.js";

const {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRY = "14d",
  ACCESS_TOKEN_EXPIRY = "7d",
} = process.env;

const otpStore = new Map();
const authService = new AuthService();

class AuthController {
  static async registerUser(req, res) {
    try {
      const { otp, email, user } = await authService.registerUser(req.body);

      // await sendMail(
      //   email,
      //   "Your OTP Code",
      //   `Your OTP is: ${otp}`,
      //   `<p>Your OTP is: <strong>${otp}</strong></p>`
      // );

      return res.status(201).json({
        message: "User registered successfully. OTP sent to email.",
        user,
      });
    } catch (error) {
      const status =
        error.status ||
        (error.name === "SequelizeUniqueConstraintError" ? 400 : 500);
      console.error("Error:", error);
      return res.status(status).json({
        message:
          status === 500 ? `Server Error: ${error.message}` : error.message,
      });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      let response = await loginHelper({ email, password });

      if (response.error) {
        return res.status(400).json({
          message: response.error.details[0].message,
        });
      }

      const user = await authService.authenticateCredentials(email, password);

      const tokenPayload = {
        data: {
          id: user.id,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.roles,
          collegeId: user.collegeId,
          consultancyId: user.consultancyId,
        },
      };

      const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });

      const refreshToken = jwt.sign(tokenPayload, REFRESH_TOKEN, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });

      res.setHeader("x-refresh-token", refreshToken);
      res.header("Access-Control-Expose-Headers", "x-refresh-token");
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        domain: NODE_ENV === "production" ? ".merouni.com" : undefined,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: "Login successful", accessToken, refreshToken });
    } catch (error) {
      const status = error.status || 500;
      console.error("Error logging in:", error);
      res.status(status).json({
        message: status === 500 ? `Server error ${error}` : error.message,
      });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const user = await authService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.otp) {
        return res
          .status(400)
          .json({ message: "OTP not found. Please request a new OTP." });
      }

      if (String(user.otp) !== String(otp)) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (new Date() > user.otpExpiresAt) {
        return res
          .status(400)
          .json({ message: "Expired OTP. Request a new one." });
      }

      let updatedRoles =
        typeof user.roles === "string" ? JSON.parse(user.roles) : user.roles;
      updatedRoles.student = true;

      await authService.updateUser(
        { email },
        { roles: updatedRoles, otp: null, otpExpiresAt: null }
      );

      return res
        .status(200)
        .json({ message: "OTP verified successfully. Role updated!" });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }

  static async resendOtp(req, res) {
    try {
      const { email } = req.body;

      const user = await authService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const now = new Date();
      if (user.otpExpiresAt && now - user.otpExpiresAt < 5 * 60 * 1000) {
        return res
          .status(429)
          .json({ message: "Please wait before requesting a new OTP." });
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);

      await authService.updateUser({ email }, { otp: newOtp, otpExpiresAt });


      return res.status(200).json({ message: "New OTP sent successfully." });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }

  static async logoutUser(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
      });

      res.setHeader("x-refresh-token", "");

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      let response = await forgotPasswordHelper(req.body);

      if (response.error) {
        return res.status(400).json({
          message: response.error.details[0].message,
        });
      }

      const user = await authService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const otp = crypto.randomInt(100000, 999999).toString();

      otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

      await sendMail(
        email,
        "Password Reset OTP",
        `Your OTP is: ${otp}`,
        `<p>Your OTP is: <strong>${otp}</strong></p>`
      );

      return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { email, otp, new_password: newPassword } = req.body;

      let response = await resetPasswordHelper(req.body);

      if (response.error) {
        return res.status(400).json({
          message: response.error.details[0].message,
        });
      }

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const storedOtpData = otpStore.get(email);

      if (!storedOtpData || storedOtpData.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      otpStore.delete(email);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await authService.updateUser({ email }, { password: hashedPassword });

      return res
        .status(200)
        .json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: `Server Error: ${error.message}` });
    }
  }
}

export default AuthController;
