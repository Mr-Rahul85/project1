import express from "express";
import Booking from "../model/booking.js";
import Destination from "../model/destinations.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const allDestinations = await Destination.find({});
    const prefilledDestination = req.query.dest || "";

    res.render("pages/booking", {
      cards: allDestinations,
      selectedDest: prefilledDestination,
      title: "Booking",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading booking page");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      guests,
      fullName,
      email,
      phone,
      requests,
    } = req.body;

    const userId = req.session.userId;

    const newBooking = new Booking({
      userId,
      destination,
      startDate,
      endDate,
      guests,
      fullName,
      email,
      phone,
      requests,
    });

    await newBooking.save();

    res.redirect("/booking?booking=success");
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).send("Failed to save booking. Please try again.");
  }
});

router.post("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!booking) {
      return res
        .status(404)
        .send("Booking not found or you do not have permission to cancel it.");
    }

    booking.status = "Cancelled";
    await booking.save();

    res.redirect("/profile");
  } catch (error) {
    console.error("Cancellation Error:", error);
    res.status(500).send("Failed to cancel booking. Please try again.");
  }
});

export default router;
