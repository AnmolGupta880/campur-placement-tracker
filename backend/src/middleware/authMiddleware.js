import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

export const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2️⃣ Extract token
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
      }

      // 3️⃣ Verify token
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // 4️⃣ Attach user to request based on userType
      if (decoded.userType === "teacher") {
        req.user = await Teacher.findById(decoded.id).select("-password");
        req.userType = "teacher";
      } else if (decoded.userType === "student") {
        req.user = await Student.findById(decoded.id).select("-password");
        req.userType = "student";
      } else {
        return res.status(401).json({ message: "Invalid user type" });
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 5️⃣ Continue
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      console.error("Auth middleware error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // 6️⃣ If no token
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};