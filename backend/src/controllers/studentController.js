import Student from "../models/Student.js";
import College from "../models/College.js";

// @desc   Create a new student
// @route  POST /api/students
export const createStudent = async (req, res) => {
  try {
    const { name, email, branch, cgpa, collegeId } = req.body;

    if (!name || !email || !collegeId) {
      return res
        .status(400)
        .json({ message: "Name, email and college are required" });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const student = await Student.create({
      name,
      email,
      branch,
      cgpa,
      college: collegeId,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Bulk create students (DEV ONLY)
// @route  POST /api/students/bulk
export const bulkCreateStudents = async (req, res) => {
  try {
    const students = req.body;

    if (!Array.isArray(students)) {
      return res.status(400).json({ message: "Array of students required" });
    }

    const created = await Student.insertMany(students, {
      ordered: false
    });

    return res.status(201).json({
      message: "Bulk students inserted",
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


// @desc   Get all students
// @route  GET /api/students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("college", "name");
    
    // Add eligibility status based on CGPA (threshold: 7.0)
    const studentsWithEligibility = students.map(student => ({
      ...student.toObject(),
      isEligible: student.cgpa >= 7.0,
    }));
    
    res.json(studentsWithEligibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current student profile
// @route  GET /api/students/profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate("college", "name")
      .select("-password");
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isEligible = student.cgpa >= 7.0;
    
    res.json({
      ...student.toObject(),
      isEligible,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
