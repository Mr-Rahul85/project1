import express from "express";
import Post from "../model/post.js";
const router = express.Router();

router.get("/video", async (req, res) => {
  try {
    const videos = await Post.find({ mediaType: "video" });
   
    res.render("pages/video", { videos, title: "Videos" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load videos");
  }
});

export default router;
