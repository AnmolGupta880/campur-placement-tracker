import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { bulkCreateStudents } from "../controllers/studentController.js";

import {
  createStudent,
  getStudents,
  getStudentProfile,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.post("/bulk", bulkCreateStudents);
router.get("/profile", protect, getStudentProfile);

export default router;
