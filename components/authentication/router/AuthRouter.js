import express from "express";

import { RegisterUser } from "../controller/RegisterController.js";
import { loginUser } from "../controller/LoginController.js";
import { verifyOtp } from "../controller/VerifyOTP.js";

const route = express.Router();

route.post("/register", RegisterUser);
route.post("/login", loginUser);
route.post("/verify-otp", verifyOtp);

export default route;
