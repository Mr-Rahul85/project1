const ALLOWED_ADMINS = [
  "admin1@gmail.com",
  "admin2@gmail.com"
];

const adminOnly = (req, res, next) => {
  if (
    req.admin?.role === "admin" &&
    ALLOWED_ADMINS.includes(req.admin.email)
  ) {
    return next();
  }
  return res.status(403).json({ message: "Admins only" });
};

export default adminOnly;
