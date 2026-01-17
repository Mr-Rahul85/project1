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
    // user: req.session.userId,
    pageCss: "place-card.css",
    cards,
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

  if (!destination) {
    res.status(404).render("pages/404");
  }

  res.render("pages/place-content", {
    destination,
    cards: randomCards,
  });
});

export default router;
