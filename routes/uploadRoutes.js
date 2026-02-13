import express from "express";
import pageAuth from "../middleware/pageAuth.js";
import adminOnly from "../middleware/adminOnly.js";
const router = express.Router();

router.get(
  "/upload",
  pageAuth,      // <-- add this

  (req, res) => {
    res.render("pages/index", {
      isAdminPage: true,
      user: req.user,   // <-- PASS USER
      status: req.query.status || null,
      error: req.query.error,
    });
  }
);


export default router;