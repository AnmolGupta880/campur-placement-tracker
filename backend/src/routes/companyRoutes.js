import express from "express";
import { 
  getCompanies, 
  bulkCreateCompanies,
  createCompany 
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getCompanies);
router.post("/", createCompany);
router.post("/bulk", bulkCreateCompanies);

export default router;