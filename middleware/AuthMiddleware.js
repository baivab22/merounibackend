import jwt from "jsonwebtoken";
import UserModel from "../components/users/model/UserModel.js";

export const authenticateUser = async (req, res, next) => {
  const accessToken =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];
  const { ACCESS_TOKEN, REFRESH_TOKEN, NODE_ENV, ACCESS_TOKEN_EXPIRY } =
    process.env;

  // 1. Validate Access Token
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, JWT_TOKEN);
      req.user = decoded.data;
      return next(); // Token is valid, proceed
    } catch (error) {
      if (!(error instanceof jwt.TokenExpiredError)) {
        return res
          .status(403)
          .json({ status: 403, message: "Invalid Access Token" });
      }
      // If expired, proceed to refresh token verification
    }
  }

  // 2. Validate Refresh Token
  if (!refreshToken) {
    return res
      .status(401)
      .json({ status: 401, message: "No Refresh Token Provided" });
  }

  // 3. Decode Refresh Token
  let decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN);
  let user_id = decodedRefresh.data.id;

  // 4. Find User in Database
  let user = await UserModel.findByPk(user_id);
  if (!user) {
    return res.status(401).json({ status: 401, message: "User not found" });
  }

  // 5. Generate New Access Token
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
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );

  // 6. Set Response Headers and Cookies
  res.cookie("token", newAccessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  req.user = { id: user.id, email: user.email, role: user.roles };
  next();
};
