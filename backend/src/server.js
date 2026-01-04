import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("\n❌ ERROR: JWT_SECRET is not set in environment variables");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("💡 Please create a .env file in the backend directory with:");
  console.error("   JWT_SECRET=your_secret_key_here_make_it_long_and_random");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("\n❌ ERROR: MONGO_URI is not set in environment variables");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("💡 Please create a .env file in the backend directory with:");
  console.error("   For local MongoDB:");
  console.error("   MONGO_URI=mongodb://localhost:27017/campus-placement");
  console.error("");
  console.error("   For MongoDB Atlas:");
  console.error("   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  process.exit(1);
}

// Connect to database (will exit if connection fails)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase limit for resume uploads

// Routes
app.use("/api/colleges", collegeRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Campus Placement Tracker API running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
