import jwt from "jsonwebtoken";
import UserModel from "../components/users/model/UserModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.token;
    const refreshToken = req.headers["x-refresh-token"];
    const { ACCESS_TOKEN, REFRESH_TOKEN, NODE_ENV, ACCESS_TOKEN_EXPIRY } =
      process.env;

    // 1. First try access token
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
        req.user = decoded.data;
        return next();
      } catch (error) {
        console.log("Access token verification failed:", error.message);
        if (!(error instanceof jwt.TokenExpiredError)) {
          return res
            .status(403)
            .json({ status: 403, message: "Invalid access token" });
        }
      }
    }

    // 2. Handle refresh token
    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: 401, message: "Authentication required" });
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN);
      const user = await UserModel.findByPk(decodedRefresh.data.id);
      if (!user) {
        return res.status(401).json({ status: 401, message: "User not found" });
      }

      // 3. Generate new access token
      const newAccessToken = jwt.sign(
        {
          data: {
            id: user.id,
            firstName: user.first_name,
            middleName: user.last_name,
            lastName: user.last_name,
            email: user.email,
            phoneNo: user.phone_no,
            role: user.roles,
          },
        },
        ACCESS_TOKEN,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      // 4. Set new access token in cookie AND header
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        domain: NODE_ENV === "production" ? ".merouni.com" : undefined,
        maxAge: 24 * 60 * 60 * 1000,
      });

      req.user = decodedRefresh.data;
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: "Invalid refresh token",
        details: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      details: error.message,
    });
  }
};
