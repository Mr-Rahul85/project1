import express from "express";
import User from "../model/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import noCache from "../middleware/noCache.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();

router.get("/profile", noCache,requireAuth, authMiddleware, async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("pages/profile", {
    user: req.user,
    user,
  });
});

router.post("/api/wishlist", requireAuth, async (req, res) => {
  try {
    const { cardId } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.sendStatus(401);

    // const index = user.wishlist.indexOf(cardId);
    const index = user.wishlist.findIndex(
      id => id.toString() === cardId
    );
    let action;

    if (index === -1) {
      user.wishlist.push(cardId);
      action = "added";
    } else {
      user.wishlist.splice(index, 1);
      action = "removed";
    }

    await user.save();

    res.status(200).json({
      success: true,
      action, // 👈 tells frontend what happened
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
