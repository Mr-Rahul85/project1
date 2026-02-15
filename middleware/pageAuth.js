import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

const pageAuth = (req, res, next) => {

  console.log("COOKIES:", req.cookies);

  const token = req.cookies?.token;

  if (!token) {
    console.log("NO TOKEN");
    return res.redirect("/admin/login");
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    console.log("DECODED:", decoded);

    req.user = decoded;
    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.redirect("/admin/login");
  }
};

export default pageAuth;
