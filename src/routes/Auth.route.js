import express from "express";
import AuthController from "../controllers/auth/Auth.controller.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import { registerSchema } from "../validators/authentication/Auth.validator.js";

const route = express.Router();

route.post(
  "/register",
  requestValidator(registerSchema, "body"),
  AuthController.registerUser
);
route.post("/login", AuthController.loginUser);
route.post("/verify-otp", AuthController.verifyOtp);
route.post("/resend-otp", AuthController.resendOtp);
route.post("/logout", AuthController.logoutUser);

route.post("/forgot-password", AuthController.forgotPassword);
route.post("/reset-password", AuthController.resetPassword);

export default route;
