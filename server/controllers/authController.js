import userModel from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "missing fields details",
    });
  }
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "user already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    // create token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // send cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // send a mail using transporter
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "test email",
      text: `hello nodemailer from ${email}`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "user register successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "missing fields details",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "invalid credentials",
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      return res.json({
        success: false,
        message: "invalid credentials",
      });
    }
    const newToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "user login successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
// Add rate limiting to login to slow brute-force attempts.
// Consider CSRF protection if you're using cross-site cookies, especially with SameSite: "none".
// Validate/sanitize input rather than trusting req.body.
// Don't return sensitive user/database information in errors.
// Cookie settings should be reviewed based on whether frontend/backend are same-site or cross-site.
// The browser's cookie stores the JWT, and the server verifies that JWT on subsequent protected requests.

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "user logout successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
// send verification opt to user's mail
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "user already verified",
      });
    }
    const otp = String(Math.floor(1000 * Math.random(1000) * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const sendOtpDetail = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "account verify otp",
      text: `this is your ${otp} to verify your email`,
    };
    await transporter.sendMail(sendOtpDetail);
    return res.json({
      success: true,
      message: "otp send successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;
  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "Missing details",
    });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    if (user.verifyOtp === "" || user.verifyOtp != otp) {
      return res.json({
        success: false,
        message: "invailid otp",
      });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "otp expired",
      });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "user email verified successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
// check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const passwordResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "email is required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    const otp = String(Math.floor(1000 * Math.random(1000) * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const sendOtpDetail = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "password reset otp",
      text: `this is your ${otp} to reset your password`,
    };
    await transporter.sendMail(sendOtpDetail);
    return res.json({
      success: true,
      message: "otp send successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.json({
        success: false,
        message: "missing field details",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    if (otp === "" || user.resetOtp != otp) {
      return res.json({
        success: false,
        message: "invalid otp",
      });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "otp expired",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.json({
      success:true,
      message:"password reset successfully"
    })
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
