import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllStudents, getTeacherStats } from "../controllers/teacherController.js";

const router = express.Router();

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (req.userType !== "teacher") {
    return res.status(403).json({ message: "Access denied. Teacher only." });
  }
  next();
};

router.get("/students", protect, isTeacher, getAllStudents);
router.get("/stats", protect, isTeacher, getTeacherStats);

// Error handling middleware for this router
router.use((err, req, res, next) => {
  console.error("Teacher route error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default router;

