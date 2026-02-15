import express from "express";
import pageAuth from "../middleware/pageAuth.js";
import User from "../model/user.js"; // 👈 Add this import

const router = express.Router();

router.get("/upload", pageAuth, async (req, res) => {
  try {
    
    const fullUser = await User.findById(req.user.id);

    
    res.render("pages/index", {
      isAdminPage: true,
      user: fullUser, 
      status: req.query.status || null,
      error: req.query.error,
    });
  } catch (err) {
    console.error("Render Crash:", err);
    res.status(500).send("Server Error in Upload Route");
  }
});


export default router;