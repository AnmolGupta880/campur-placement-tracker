import express from "express";
import { 
  signupStudent, 
  loginStudent,
  signupTeacher,
  loginTeacher 
} from "../controllers/authController.js";

const router = express.Router();

// Student routes
router.post("/signup", signupStudent);
router.post("/login", loginStudent);

// Teacher routes
router.post("/teacher/signup", signupTeacher);
router.post("/teacher/login", loginTeacher);

export default router;