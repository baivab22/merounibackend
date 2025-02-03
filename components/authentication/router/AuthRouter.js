import express from "express";

import { RegisterUser } from "../controller/RegisterController.js";
import { loginUser } from "../controller/LoginController.js";
import { verifyOtp } from "../controller/VerifyOTP.js";
import { resendOtp } from "../controller/ResendOtp.js";
import { logoutUser } from "../controller/LogoutController.js";

const route = express.Router();

route.post("/register", RegisterUser);
route.post("/login", loginUser);
route.post("/verify-otp", verifyOtp);
route.post("/resend-otp", resendOtp);
route.post("/logout", logoutUser);

export default route;
