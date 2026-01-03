import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllStudents, getTeacherStats } from "../controllers/teacherController.js";

const router = express.Router();

router.get("/students", protect, getAllStudents);
router.get("/stats", protect, getTeacherStats);

export default router;

