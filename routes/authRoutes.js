import express from "express";
import passport from "passport";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/auth", {
    layout: "layouts/auth",
    error: "",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* GOOGLE CALLBACK */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth",
  }),
  (req, res, next) => {
    req.session.regenerate((err) => {
      if (err) return next(err);

      req.session.userId = req.user._id;
      res.redirect("/");
    });
  }
);

export default router;
