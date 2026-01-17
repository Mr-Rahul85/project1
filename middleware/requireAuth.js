export const requireAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }

  if (req.session && req.session.userId) {
    return next();
  }


  if (req.originalUrl.startsWith("/api")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.redirect("/auth");

};
