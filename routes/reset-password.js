import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../model/user.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { token } = req.query;

  res.render("reset-password", { token, layout: "layouts/auth" });
});

router.post("/:token", async (req, res) => {
  try {
    const unhashedToken = req.params.token;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(unhashedToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or has expired. Please request a new link.",
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    
    await user.save();

    
    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "A server error occurred while resetting the password.",
    });
  }
});

export default router;
