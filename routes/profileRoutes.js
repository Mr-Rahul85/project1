import express from "express";
import User from "../model/user.js";
import Booking from "../model/booking.js";
import authMiddleware from "../middleware/authMiddleware.js";
import noCache from "../middleware/noCache.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();


const renderProfilePage = async (req, res, activeTabName) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/");
    }

    
    const populatedUser = await User.findById(req.user._id).populate("wishlist");
    

    const userBookings = await Booking.find({
      userId: req.session.userId,
    }).sort({ createdAt: -1 });

    
    res.render("pages/profile", {
      user: populatedUser, 
      bookings: userBookings,
      activeTab: activeTabName, 
      title: "Profile | Hidden Bihar",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile");
  }
};


router.get(
  "/profile",
  noCache,
  requireAuth,
  authMiddleware,
  (req, res) => {
    renderProfilePage(req, res, "profile");
  }
);


router.get(
  "/profile/favorite",
  noCache,
  requireAuth,
  authMiddleware,
  (req, res) => {
    renderProfilePage(req, res, "favorite");
  }
);


router.get(
  "/profile/bookings",
  noCache,
  requireAuth,
  authMiddleware,
  (req, res) => {
    renderProfilePage(req, res, "bookings");
  }
);
router.post("/profile/update", requireAuth, async (req, res) => {
  try {
    
    const { username, email, phone, about } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      username,
      email,
      phone,
      about,
    });

    res.redirect("/profile?update=success");
  } catch (err) {
    console.error("UPDATE ERROR:", err); 
    res.status(500).send("Update failed");
  }
});


router.post("/api/wishlist", requireAuth, async (req, res) => {
  try {
    const { cardId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.sendStatus(401);

    const isInWishlist = user.wishlist.some((id) => id.toString() === cardId);
    let action;

    if (isInWishlist) {
      await User.findByIdAndUpdate(userId, {
        $pull: { wishlist: cardId },
      });
      action = "removed";
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { wishlist: cardId },
      });
      action = "added";
    }

    res.status(200).json({
      success: true,
      action,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;