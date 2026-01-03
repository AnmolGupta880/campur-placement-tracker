import College from "../models/College.js";

// @desc   Create a new college
// @route  POST /api/colleges
export const createCollege = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ message: "College name is required" });
    }

    const existingCollege = await College.findOne({ name });
    if (existingCollege) {
      return res.status(400).json({ message: "College already exists" });
    }

    const college = await College.create({ name, location });

    res.status(201).json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const bulkCreateColleges = async (req, res) => {
  try {
    const colleges = req.body;

    if (!Array.isArray(colleges)) {
      return res.status(400).json({ message: "Array of colleges required" });
    }

    const created = await College.insertMany(colleges, {
      ordered: false
    });

    return res.status(201).json({
      message: "Bulk insert successful",
      insertedCount: created.length,
      data: created
    });
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000 || error.writeErrors) {
      return res.status(207).json({
        message: "Bulk insert completed (duplicates skipped)",
      });
    }

    return res.status(500).json({ message: error.message });
  }
};

// @desc   Get all colleges
// @route  GET /api/colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
