import express from "express";
const router = express.Router();
import upload from "../middleware/multer.js";
import Post from "../model/post.js";
import { uploadAndSave } from "../services/uploadServices.js";
import pageAuth from "../middleware/pageAuth.js";

router.post("/",pageAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    await uploadAndSave({
      filePath: req.file.path,
      folder: "uploads/posts",
      Model: Post,
      body: req.body
    });

    res.json({
      success: true,
      message: "Post uploaded successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
});

export default router;
