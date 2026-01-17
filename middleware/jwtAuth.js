import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "JWT missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.admin = decoded; // keep separate from req.user (passport)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired JWT" });
  }
};

export default jwtAuth;
