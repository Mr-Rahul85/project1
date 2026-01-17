import express from "express";
import upload from "../middleware/multerFeedback.js";
import Feedback from "../model/feedback.js";
import cloudinary from "../config/cloudinary.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/feedback", { success: false });
});

router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const { type, rating, message, email } = req.body;

    if (!type || !rating || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { secure_url, public_id, resource_type } =
      await cloudinary.uploader.upload(req.file.path, {
        folder: "feedback_screenshots",
      });

    await Feedback.create({
      type,
      rating,
      message,
      email,
      screenshot: {
        mediaUrl: secure_url,
        publicId: public_id,
        mediaType: resource_type,
      },
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });

  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
