import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import adminOnly from "../middleware/adminOnly.js";
const router = express.Router();

router.get("/upload",(req, res) => {
  res.render("pages/index", {
    status: req.query.status || null,
    error: req.query.error,
  });

});

export default router;