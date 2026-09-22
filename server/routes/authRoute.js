import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  passwordResetOtp,
  resetPassword,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

export const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);
route.post("/logout", logoutUser);
route.post("/send-verify-otp", userAuth, sendVerifyOtp);
route.post("/verify-account", userAuth, verifyEmail);
route.post("/is-auth", userAuth, isAuthenticated);
route.post("/send-password-reset-otp", passwordResetOtp);
route.post("/password-resets", resetPassword);
