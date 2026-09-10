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
    // send a message

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
      sameSite: process.env.NODE_ENV === "prouduction" ? "none" : "strict",
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

export const sendVerifyOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const sendOtpDetail = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "verify otp",
      text: `this is your ${otp} to verify your email`,
    };
    await transporter.sendMail(sendOtpDetail);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};