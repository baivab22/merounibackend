import express from "express";
import AuthController from "../controllers/auth/Auth.controller.js";

const route = express.Router();

route.post("/register", AuthController.registerUser);
route.post("/login", AuthController.loginUser);
route.post("/verify-otp", AuthController.verifyOtp);
route.post("/resend-otp", AuthController.resendOtp);
route.post("/logout", AuthController.logoutUser);

route.post("/forgot-password", AuthController.forgotPassword);
route.post("/reset-password", AuthController.resetPassword);

export default route;
