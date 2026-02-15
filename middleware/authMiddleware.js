const authMiddleware = (req, res,next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  if (req.originalUrl.startsWith("/api")) {
    return res.status(401).json({ expired: true });
  }

  if (!req.session || !req.session.userId) {
    return res.redirect("/auth?expired=true");
  }
};

export default authMiddleware;
