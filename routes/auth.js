const express = require("express");
const router = express.Router();
const crypto = require("crypto"); 
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendResetEmail } = require("../config/mailer");


const isStrongPassword = (password) => {
  const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return strongRegex.test(password);
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

     if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character.",
      });
    }

     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});
 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

     const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

     const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

     res.status(200).json({
      message: "Login successful!",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

 
 router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

     const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

     const resetToken = crypto.randomBytes(32).toString("hex");

     const expiryMinutes = parseInt(process.env.RESET_TOKEN_EXPIRY) || 15;
    const expiryTime = new Date(Date.now() + expiryMinutes * 60 * 1000);

     user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiryTime;
    await user.save();

     const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetLink, user.name);

    res.status(200).json({
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

 
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;

     const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or has expired.",
      });
    }

     res.status(200).json({ message: "Token is valid.", email: user.email });
  } catch (error) {
    console.error("Verify Token Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

 
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

     const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or has expired.",
      });
    }

     if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character.",
      });
    }

     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;