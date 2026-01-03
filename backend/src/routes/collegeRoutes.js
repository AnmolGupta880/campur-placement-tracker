import express from "express";
import {
  createCollege,
  getColleges,
  bulkCreateColleges
} from "../controllers/collegeController.js";

const router = express.Router();

// normal routes
router.post("/", createCollege);
router.get("/", getColleges);

// bulk route (DEV ONLY)
router.post("/bulk", bulkCreateColleges);

export default router;