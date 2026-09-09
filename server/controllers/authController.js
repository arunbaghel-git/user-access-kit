import userModel from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.json({
      success: false,
      message: "missing fields details",
    });
  }
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.json({
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
    return res.json({
      success: true,
      message: "user register successfully",
      newUser, // for test in postman only return full newUser object
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
        message: "email is invalid",
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
