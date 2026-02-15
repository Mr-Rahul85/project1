import express from "express";
import Booking from "../model/booking.js";
import pageAuth from "../middleware/pageAuth.js";
import User from "../model/user.js";

const router = express.Router();
router.get("/", pageAuth, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const bookings = await Booking.find();

    res.render("pages/booking-request", {
      isAdminPage: true,
      user: fullUser,
      bookings,
      status: req.query.status || null,
      error: req.query.error,
      title:"booking request"
    });
  } catch (err) {
    console.error("Render Crash:", err);
    res.status(500).send("Server Error in Booking Request Route");
  }
});

router.get("/:id", pageAuth, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .render("pages/404", { title: "Booking Not Found" });
    }

    res.render("pages/booking-request-detail", {
      isAdminPage: true,
      user: fullUser,
      booking: booking,
      title:"booking request detail"
    });
  } catch (err) {
    console.error("Error fetching booking details:", err);
    res.status(500).send("Server Error");
  }
});

router.post("/:id/status", pageAuth, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    await Booking.findByIdAndUpdate(bookingId, { status: status });

    res.redirect(`/admin/booking-request/${bookingId}`);
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).send("Server Error");
  }
});

export default router;
