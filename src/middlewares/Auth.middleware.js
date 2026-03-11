import jwt from "jsonwebtoken";
import UserModel from "../models/users/User.model.js";

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
            middleName: user.middle_name,
            lastName: user.last_name,
            email: user.email,
            phoneNo: user.phone_no,
            roles: user.roles,
            role: user.roles, // Keep 'role' for backward compatibility
            collegeId: user.collegeId,
            consultancyId: user.consultancyId,
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

      // Set req.user with fresh user data from database, including roles
      req.user = {
        id: user.id,
        firstName: user.first_name,
        middleName: user.middle_name,
        lastName: user.last_name,
        email: user.email,
        phoneNo: user.phone_no,
        roles: user.roles,
        role: user.roles, // Keep 'role' for backward compatibility
        collegeId: user.collegeId,
        consultancyId: user.consultancyId,
      };
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

export const optionalAuthenticateUser = async (req, res, next) => {
  try {
    req.user = null;
    const accessToken = req.cookies.token;
    const refreshToken = req.headers["x-refresh-token"];
    const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;

    let userId = null;

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
        userId = decoded.data?.id;
      } catch (error) {
      }
    }
    console.log(userId,"userIduserIduserId");
    

    if (!userId && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN);
        userId = decodedRefresh.data?.id;
      } catch (error) {
        // Refresh token invalid too
      }
    }

    if (userId) {
      const user = await UserModel.findByPk(userId);
      if (user) {
        req.user = {
          id: user.id,
          firstName: user.first_name,
          middleName: user.middle_name,
          lastName: user.last_name,
          email: user.email,
          phoneNo: user.phone_no,
          roles: user.roles,
          role: user.roles, // Keep 'role' for backward compatibility
          collegeId: user.collegeId,
          consultancyId: user.consultancyId,
        };
      }
    }
  } catch (error) {
    req.user = null;
  }

  return next();
};
