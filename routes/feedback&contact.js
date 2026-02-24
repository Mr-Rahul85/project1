import express from "express";
import pageAuth from "../middleware/pageAuth.js";
import User from "../model/user.js";
import Contact from "../model/contact.js";
import Feedback from "../model/feedback.js";

const router = express.Router();

// Main Dashboard Route
router.get("/", pageAuth, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.render("pages/feedback&contact", {
      contacts,
      feedbacks,
      isAdminPage: true,
      user: fullUser,
      status: req.query.status || null,
      error: req.query.error,
      title: "Feedback & Contact Req",
    });
  } catch (error) {
    console.error("Error loading the dashboard:", error);
    res.status(500).send("Server Error while loading the dashboard.");
  }
});

// 1. UNIQUE PATH FOR CONTACTS
router.get("/contact/:id", pageAuth, async (req, res) => {
  try {
    const contactId = req.params.id;
    const fullUser = await User.findById(req.user.id);
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).send("Contact inquiry not found.");
    }

    res.render("pages/contact-detail", {
      contact,
      isAdminPage: true,
      user: fullUser
    });
  } catch (error) {
    console.error("Error fetching contact detail:", error);
    res.status(500).send("Server Error");
  }
});

// 2. UNIQUE PATH FOR FEEDBACKS
router.get("/feedback/:id", pageAuth, async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const fullUser = await User.findById(req.user.id);
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).send("Feedback not found.");
    }

    res.render("pages/feedback-detail", {
      feedback,
      isAdminPage: true,
      user: fullUser,
    });
  } catch (error) {
    console.error("Error fetching feedback detail:", error);
    res.status(500).send("Server Error");
  }
});

export default router;
