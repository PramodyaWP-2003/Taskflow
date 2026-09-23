import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userPayload = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/me
export const getMe = (req, res) => {
  res.json({ user: userPayload(req.user) });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // random token; only its hash is saved in the database
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save({ validateBeforeSave: false });

      const link = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

      // No email service yet, so the link is printed in this terminal.
      // In a real app you would email it to the user here.
      console.log("\n=== PASSWORD RESET LINK ===");
      console.log(`For: ${user.email}`);
      console.log(link);
      console.log("Valid for 15 minutes\n");
    }

    // same reply whether or not the email exists
    res.json({ message: "If that email is registered, a reset link has been created." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user)
      return res.status(400).json({ message: "Reset link is invalid or has expired" });

    user.password = password; // hashed automatically by the pre-save hook
    user.resetPasswordToken = undefined; // link can't be used a second time
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated. You can log in now." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};