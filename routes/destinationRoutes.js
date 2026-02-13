import express from "express";
import Destination from "../model/destinations.js";
import { requireAuth } from "../middleware/requireAuth.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", requireAuth, authMiddleware, async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth");
  }
  const cards = await Destination.find();
  res.render("pages/destination", {
    pageCss: "place-card.css",
    cards,
    title: "All Destinations",
  });
});
router.get("/:name", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth");
  }
  const cards = await Destination.find();
  const shuffled = cards.sort(() => 0.3 - Math.random());
  const randomCards = shuffled.slice(0, 3);
  const destination = await Destination.findOne({
    name: req.params.name,
  });
  const formattedName = destination.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  if (!destination) {
    res.status(404).render("pages/404");
  }

  res.render("pages/place-content", {
    destination,
    cards: randomCards,
    title: `${formattedName}`,
  });
});

export default router;
