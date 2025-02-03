import UserModel from "../../users/model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let { ACCESS_TOKEN, REFRESH_TOKEN, NODE_ENV } = process.env;
let REFRESH_TOKEN_EXPIRY = "7d";
let ACCESS_TOKEN_EXPIRY = "15m";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await UserModel.findOne({ where: { email } });
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
      { data: { id: user.id, email: user.email, role: user.roles } },
      ACCESS_TOKEN,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      { data: { id: user.id, email: user.email, role: user.roles } },
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
      sameSite: "lax",
      maxAge: parseInt(ACCESS_TOKEN_EXPIRY),
    });

    return res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: `Server error ${error}` });
  }
};
