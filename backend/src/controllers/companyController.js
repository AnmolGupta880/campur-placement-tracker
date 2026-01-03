import Company from "../models/Company.js";
import College from "../models/College.js";


// @desc   Create a new company
// @route  POST /api/companies
export const createCompany = async (req, res) => {
  try {
    const { 
      name, 
      role, 
      ctc, 
      eligibility, 
      collegeId, 
      driveDate, 
      description, 
      location, 
      website 
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    // If collegeId is provided, validate it
    if (collegeId) {
      const college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
    }

    const company = await Company.create({
      name,
      role,
      ctc,
      eligibility,
      driveDate: driveDate ? new Date(driveDate) : undefined,
      description,
      location,
      website,
      college: collegeId || undefined,
    });

    const populatedCompany = await Company.findById(company._id).populate("college", "name");

    res.status(201).json(populatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc   Bulk create companies (DEV ONLY)
// @route  POST /api/companies/bulk
export const bulkCreateCompanies = async (req, res) => {
  try {
    const companies = req.body;

    if (!Array.isArray(companies)) {
      return res.status(400).json({ message: "Array of companies required" });
    }

    const created = await Company.insertMany(companies, {
      ordered: false
    });

    return res.status(201).json({
      message: "Bulk companies inserted",
      insertedCount: created.length,
      data: created
    });
  } catch (error) {
    if (error.code === 11000 || error.writeErrors) {
      return res.status(207).json({
        message: "Bulk insert completed (duplicates skipped)"
      });
    }

    return res.status(500).json({ message: error.message });
  }
};


// @desc   Get all companies
// @route  GET /api/companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("college", "name");
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
