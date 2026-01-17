import User from "../model/User.js";

const currentUser = async (req, res, next) => {
  try {
    // ✅ 1. Passport user (OAuth)
    if (req.user) {
      res.locals.user = req.user;
      return next();
    }

    // ✅ 2. Manual session user
    if (req.session?.userId) {
      const user = await User.findById(req.session.userId).lean();
      if (user) {
        req.user = user; // 🔥 normalize
        res.locals.user = user;
        return next();
      }
    }

    // ❌ Not logged in
    req.user = null;
    res.locals.user = null;
    next();
  } catch (err) {
    console.error("currentUser error:", err);
    req.user = null;
    res.locals.user = null;
    next();
  }
};

export default currentUser;
