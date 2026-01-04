import mongoose from "mongoose";
import dotenv from "dotenv";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedTeacher = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Default teacher credentials
    const defaultTeacher = {
      name: "Admin Teacher",
      email: "teacher@admin.com",
      password: "admin123", // Will be hashed
    };

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ 
      email: defaultTeacher.email 
    });

    if (existingTeacher) {
      console.log("⚠️  Teacher already exists with email:", defaultTeacher.email);
      console.log("📧 Email:", defaultTeacher.email);
      console.log("🔑 Password: admin123");
      console.log("\nYou can use these credentials to login.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(defaultTeacher.password, 10);

    // Create teacher
    const teacher = await Teacher.create({
      name: defaultTeacher.name,
      email: defaultTeacher.email,
      password: hashedPassword,
    });

    console.log("✅ Default teacher created successfully!");
    console.log("\n📋 Teacher Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", defaultTeacher.email);
    console.log("🔑 Password: admin123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("💡 You can create more teachers by running this script again with different credentials.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding teacher:", error);
    process.exit(1);
  }
};

seedTeacher();

