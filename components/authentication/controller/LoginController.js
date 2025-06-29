import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../../users/model/UserModel.js";
import { loginHelper } from "../helper/AuthHelper.js";

let { ACCESS_TOKEN, REFRESH_TOKEN, NODE_ENV } = process.env;
let REFRESH_TOKEN_EXPIRY = "14d";
let ACCESS_TOKEN_EXPIRY = "7d";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let response = loginHelper({ email, password });

    if (response.error) {
      return res.status(400).json({
        message: response.error.details[0].message,
      });
    }

    // 1. Find the user by email
    const user = await UserModel.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: `User not found of ${email}` }); // 401 Unauthorized
    }

    // 2. Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password didn't matched" });
    }
    // 3. Generate access and refresh token
    const accessToken = jwt.sign(
      {
        data: {
          id: user.id,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.roles,
        },
      },
      ACCESS_TOKEN,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      {
        data: {
          id: user.id,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.roles,
        },
      },
      REFRESH_TOKEN,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      }
    );
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
    console.error("Error logging in:", error);
    res.status(500).json({ message: `Server error ${error}` });
  }
};
