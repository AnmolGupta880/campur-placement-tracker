import mongoose from "mongoose";
import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";

/*
|--------------------------------------------------------------------------
| APPLY TO COMPANY
|--------------------------------------------------------------------------
| POST /api/applications
| Protected (JWT)
*/
export const applyToCompany = async (req, res) => {
  try {
    const studentId = req.user?._id; // comes from auth middleware
    
    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { companyId, resume, resumeFileName } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    // Validate resume size if provided (max 5MB base64)
    if (resume && resume.length > 7 * 1024 * 1024) { // ~5MB base64 = ~7MB string
      return res.status(400).json({ message: "Resume file is too large. Maximum size is 5MB." });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const alreadyApplied = await Application.findOne({
      student: studentId,
      company: companyId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied to this company",
      });
    }

    const application = await Application.create({
      student: studentId,
      company: companyId,
      status: "Applied",
      resume: resume || null,
      resumeFileName: resumeFileName || null,
    });

    const populatedApplication = await Application.findById(application._id)
      .populate("company", "name role ctc");

    return res.status(201).json(populatedApplication);
  } catch (error) {
    console.error("Apply error:", error);
    return res.status(500).json({ 
      message: error.message || "Failed to submit application" 
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET LOGGED-IN STUDENT APPLICATIONS
|--------------------------------------------------------------------------
| GET /api/applications
| Protected (JWT)
*/
export const getApplications = async (req, res) => {
  try {
    const studentId = req.user._id;

    const applications = await Application.find({ student: studentId })
      .populate("company", "name role ctc")
      .sort({ createdAt: -1 });

    // ✅ ALWAYS return array
    return res.status(200).json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| GET APPLICATIONS BY STUDENT ID (ADMIN / DEV)
|--------------------------------------------------------------------------
| GET /api/applications/student/:studentId
| Public / Dev
*/
export const getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const applications = await Application.find({ student: studentId })
      .populate("company", "name role ctc")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Student apps error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/*
||--------------------------------------------------------------------------
|| UPDATE APPLICATION STATUS (TEACHER ONLY)
||--------------------------------------------------------------------------
|| PUT /api/applications/:applicationId/status
|| Protected (JWT - Teacher)
*/
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    if (!["Applied", "Shortlisted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: Applied, Shortlisted, or Rejected",
      });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    )
      .populate("student", "name email cgpa")
      .populate("company", "name role ctc");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/*
||--------------------------------------------------------------------------
|| GET ALL APPLICATIONS (TEACHER ONLY)
||--------------------------------------------------------------------------
|| GET /api/applications/all
|| Protected (JWT - Teacher)
*/
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email cgpa college")
      .populate("company", "name role ctc")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Get all applications error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| BULK CREATE APPLICATIONS (DEV ONLY)
|--------------------------------------------------------------------------
| POST /api/applications/bulk
*/
export const bulkCreateApplications = async (req, res) => {
  try {
    const applications = req.body;

    if (!Array.isArray(applications)) {
      return res.status(400).json({
        message: "Array of applications required",
      });
    }

    const created = await Application.insertMany(applications, {
      ordered: false,
    });

    return res.status(201).json({
      message: "Bulk applications inserted",
      count: created.length,
      data: created,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(207).json({
        message: "Duplicates skipped during bulk insert",
      });
    }

    return res.status(500).json({ message: error.message });
  }
};
