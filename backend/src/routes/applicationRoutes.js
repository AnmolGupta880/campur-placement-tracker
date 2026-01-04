import express from "express";
import {
  applyToCompany,
  getApplications,
  updateApplicationStatus,
  getAllApplications,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student routes
router.post("/", protect, applyToCompany);
router.get("/", protect, getApplications);

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (req.userType !== "teacher") {
    return res.status(403).json({ message: "Access denied. Teacher only." });
  }
  next();
};

// Teacher routes (only teachers can access)
router.get("/all", protect, isTeacher, getAllApplications);
router.put("/:applicationId/status", protect, isTeacher, updateApplicationStatus);

// Error handling middleware for this router
router.use((err, req, res, next) => {
  console.error("Application route error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default router;