import Student from "../models/Student.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";

// @desc   Get all students with their details
// @route  GET /api/teacher/students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("college", "name")
      .select("-password");

    // Add eligibility status and application stats
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const applications = await Application.find({
          student: student._id,
        }).populate("company", "name role ctc");

        const isEligible = student.cgpa >= 7.0;

        return {
          ...student.toObject(),
          isEligible,
          applicationsCount: applications.length,
          applications: applications,
        };
      })
    );

    res.json(studentsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get dashboard stats for teacher
// @route  GET /api/teacher/stats
export const getTeacherStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const eligibleStudents = await Student.countDocuments({ cgpa: { $gte: 7.0 } });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    res.json({
      totalStudents,
      eligibleStudents,
      nonEligibleStudents: totalStudents - eligibleStudents,
      totalApplications,
      totalCompanies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

