import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signupStudent = async (req, res) => {
  try {
    const { name, email, password, cgpa, college } = req.body;

    if (!name || !email || !password || !cgpa || !college) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      cgpa,
      college,
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      userType: "student",
      token: generateToken(student._id, "student"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      userType: "student",
      token: generateToken(student._id, "student"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signupTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      userType: "teacher",
      token: generateToken(teacher._id, "teacher"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      userType: "teacher",
      token: generateToken(teacher._id, "teacher"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
