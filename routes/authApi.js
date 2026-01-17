import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import jwtConfig from "../config/jwt.js";
import User from "../model/user.js";

const router = express.Router();

/* SIGN UP */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // CREATE SESSION
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session error",
        });
      }

      req.session.userId = user._id;

      return res.json({
        success: true,
        message: "Login successful",
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false });
  }

  const user = await User.findById(req.session.userId).select(
    "username email photo wishlist"
  );

  res.json({ success: true, user });
});
// admin panel request
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find admin
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin"
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // 4️⃣ JSON response ONLY
    return res.status(200).json({
      success: true,
      token,
      expiresIn: jwtConfig.expiresIn
    });

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/* LOGOUT */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect("/");

    res.clearCookie("travel.sid");
    res.redirect("/");
  });
});
export default router;
