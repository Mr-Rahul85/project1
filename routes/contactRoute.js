import express from "express";
import Contact from "../model/contact.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/contact", { success: null, error: null });
});



router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const newMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message send successfully!",
      data: newMessage._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


export default router;
