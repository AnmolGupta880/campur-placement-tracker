import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "../models/Company.js";
import College from "../models/College.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

// Additional 15 companies to add
const additionalCompanies = [
  {
    name: "Meta (Facebook)",
    role: "Software Engineer",
    ctc: "26 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-06-25"),
    description: "Social media and technology company focusing on virtual and augmented reality.",
    location: "Hyderabad, Bangalore",
    website: "https://www.metacareers.com",
  },
  {
    name: "Apple",
    role: "Software Engineer",
    ctc: "29 LPA",
    eligibility: "CGPA: 8.0+, No backlogs",
    driveDate: new Date("2024-07-01"),
    description: "Multinational technology company that designs and manufactures consumer electronics and software.",
    location: "Hyderabad, Bangalore",
    website: "https://www.apple.com/careers",
  },
  {
    name: "Netflix",
    role: "Software Engineer",
    ctc: "27 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-07-05"),
    description: "Global streaming entertainment service with original content and licensed programming.",
    location: "Mumbai, Bangalore",
    website: "https://jobs.netflix.com",
  },
  {
    name: "Uber",
    role: "Software Engineer",
    ctc: "25 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-07-10"),
    description: "Technology company offering ride-hailing, food delivery, and freight services.",
    location: "Bangalore, Hyderabad",
    website: "https://www.uber.com/careers",
  },
  {
    name: "PayPal",
    role: "Software Development Engineer",
    ctc: "22 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-07-15"),
    description: "Online payment system that supports online money transfers and serves as an electronic alternative to traditional methods.",
    location: "Chennai, Bangalore",
    website: "https://www.paypal.com/us/webapps/mpp/jobs",
  },
  {
    name: "Visa",
    role: "Software Engineer",
    ctc: "24 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-07-20"),
    description: "Multinational financial services corporation facilitating electronic funds transfers.",
    location: "Bangalore",
    website: "https://www.visa.com/careers",
  },
  {
    name: "Mastercard",
    role: "Software Development Engineer",
    ctc: "23 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-07-25"),
    description: "Multinational financial services corporation providing payment processing services.",
    location: "Pune, Gurgaon",
    website: "https://www.mastercard.us/en-us/vision/who-we-are/careers.html",
  },
  {
    name: "Dell Technologies",
    role: "Software Engineer",
    ctc: "16 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-08-01"),
    description: "American multinational technology company that develops, sells, repairs, and supports computers and related products.",
    location: "Bangalore, Chennai",
    website: "https://jobs.dell.com",
  },
  {
    name: "Cisco",
    role: "Software Engineer",
    ctc: "20 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-08-05"),
    description: "Multinational technology conglomerate that develops, manufactures and sells networking hardware and software.",
    location: "Bangalore",
    website: "https://www.cisco.com/c/en/us/about/careers.html",
  },
  {
    name: "VMware",
    role: "Member of Technical Staff",
    ctc: "21 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-08-10"),
    description: "Cloud computing and virtualization technology company providing software and services.",
    location: "Bangalore, Pune",
    website: "https://careers.vmware.com",
  },
  {
    name: "Red Hat",
    role: "Software Engineer",
    ctc: "19 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-08-15"),
    description: "Software company providing open-source software products to enterprises.",
    location: "Bangalore, Pune",
    website: "https://www.redhat.com/en/jobs",
  },
  {
    name: "SAP",
    role: "Associate Developer",
    ctc: "15 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-08-20"),
    description: "German multinational software corporation that makes enterprise software to manage business operations.",
    location: "Bangalore, Gurgaon",
    website: "https://www.sap.com/careers",
  },
  {
    name: "Zoho",
    role: "Software Developer",
    ctc: "14 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-08-25"),
    description: "Indian multinational technology company that develops web-based business tools and IT solutions.",
    location: "Chennai",
    website: "https://www.zoho.com/careers",
  },
  {
    name: "Razorpay",
    role: "Software Development Engineer",
    ctc: "18 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-09-01"),
    description: "Indian fintech company providing payment gateway services for businesses.",
    location: "Bangalore",
    website: "https://razorpay.com/jobs",
  },
  {
    name: "PhonePe",
    role: "Software Engineer",
    ctc: "17 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-09-05"),
    description: "Indian digital payments and financial services company.",
    location: "Bangalore",
    website: "https://www.phonepe.com/careers",
  },
];

const addMoreCompanies = async () => {
  try {
    console.log("🌱 Adding more companies...");

    // Get all colleges to assign randomly
    const allColleges = await College.find();
    if (allColleges.length === 0) {
      console.log("❌ No colleges found. Please seed colleges first.");
      process.exit(1);
    }

    // Assign random colleges to companies
    const companiesWithColleges = additionalCompanies.map((company) => ({
      ...company,
      college: allColleges[Math.floor(Math.random() * allColleges.length)]._id,
    }));

    const created = await Company.insertMany(companiesWithColleges, {
      ordered: false,
    });

    console.log(`✅ Successfully added ${created.length} companies!`);
    console.log("📊 Total companies in database:", await Company.countDocuments());
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log("⚠️ Some duplicates were skipped");
    } else {
      console.error("❌ Error adding companies:", error);
    }
    process.exit(1);
  }
};

addMoreCompanies();

