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

      // 3️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Attach user to request based on userType
      if (decoded.userType === "teacher") {
        req.user = await Teacher.findById(decoded.id).select("-password");
        req.userType = "teacher";
      } else {
        req.user = await Student.findById(decoded.id).select("-password");
        req.userType = "student";
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 5️⃣ Continue
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // 6️⃣ If no token
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};