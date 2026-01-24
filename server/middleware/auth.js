// server/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin role middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin access required" });
};
