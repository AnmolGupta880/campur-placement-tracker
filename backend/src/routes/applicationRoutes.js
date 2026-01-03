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

// Teacher routes
router.get("/all", protect, getAllApplications);
router.put("/:applicationId/status", protect, updateApplicationStatus);

export default router;