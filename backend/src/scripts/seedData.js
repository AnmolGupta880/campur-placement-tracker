import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "../models/Company.js";
import College from "../models/College.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const colleges = [
  { name: "Indian Institute of Technology Delhi", location: "New Delhi" },
  { name: "Indian Institute of Technology Bombay", location: "Mumbai" },
  { name: "Indian Institute of Technology Madras", location: "Chennai" },
  { name: "Indian Institute of Technology Kanpur", location: "Kanpur" },
  { name: "Indian Institute of Technology Kharagpur", location: "Kharagpur" },
  { name: "National Institute of Technology Trichy", location: "Tiruchirappalli" },
  { name: "National Institute of Technology Surathkal", location: "Mangalore" },
  { name: "Birla Institute of Technology and Science", location: "Pilani" },
  { name: "Delhi Technological University", location: "New Delhi" },
  { name: "Vellore Institute of Technology", location: "Vellore" },
  { name: "SRM Institute of Science and Technology", location: "Chennai" },
  { name: "Manipal Institute of Technology", location: "Manipal" },
  { name: "PES University", location: "Bangalore" },
  { name: "RV College of Engineering", location: "Bangalore" },
  { name: "BMS College of Engineering", location: "Bangalore" },
  { name: "Jadavpur University", location: "Kolkata" },
  { name: "Anna University", location: "Chennai" },
  { name: "Osmania University", location: "Hyderabad" },
  { name: "Punjab Engineering College", location: "Chandigarh" },
  { name: "Thapar Institute of Engineering and Technology", location: "Patiala" },
];

const companies = [
  {
    name: "Google",
    role: "Software Engineer",
    ctc: "25 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-03-15"),
    description: "Leading technology company specializing in internet-related services and products.",
    location: "Bangalore, Hyderabad",
    website: "https://careers.google.com",
  },
  {
    name: "Microsoft",
    role: "Software Development Engineer",
    ctc: "22 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-03-20"),
    description: "Multinational technology corporation developing computer software and services.",
    location: "Hyderabad, Bangalore",
    website: "https://careers.microsoft.com",
  },
  {
    name: "Amazon",
    role: "SDE Intern",
    ctc: "20 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-03-25"),
    description: "E-commerce and cloud computing giant offering diverse technology roles.",
    location: "Bangalore, Hyderabad, Chennai",
    website: "https://www.amazon.jobs",
  },
  {
    name: "Adobe",
    role: "Computer Scientist",
    ctc: "24 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-04-01"),
    description: "Creative software company known for Photoshop, Illustrator, and creative cloud services.",
    location: "Bangalore, Noida",
    website: "https://careers.adobe.com",
  },
  {
    name: "Goldman Sachs",
    role: "Software Engineer",
    ctc: "28 LPA",
    eligibility: "CGPA: 8.0+, No backlogs",
    driveDate: new Date("2024-04-05"),
    description: "Leading global investment banking, securities and investment management firm.",
    location: "Bangalore, Hyderabad",
    website: "https://www.goldmansachs.com/careers",
  },
  {
    name: "JP Morgan",
    role: "Technology Analyst",
    ctc: "26 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-04-10"),
    description: "Global financial services firm providing investment banking and asset management.",
    location: "Mumbai, Bangalore",
    website: "https://careers.jpmorgan.com",
  },
  {
    name: "Morgan Stanley",
    role: "Technology Associate",
    ctc: "27 LPA",
    eligibility: "CGPA: 8.0+, No backlogs",
    driveDate: new Date("2024-04-15"),
    description: "American multinational investment bank and financial services company.",
    location: "Mumbai, Bangalore",
    website: "https://www.morganstanley.com/careers",
  },
  {
    name: "Oracle",
    role: "Member Technical Staff",
    ctc: "18 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-04-20"),
    description: "Database and cloud technology company providing enterprise software solutions.",
    location: "Bangalore, Hyderabad",
    website: "https://www.oracle.com/careers",
  },
  {
    name: "IBM",
    role: "Associate Software Engineer",
    ctc: "12 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-04-25"),
    description: "Multinational technology corporation specializing in computer hardware and software.",
    location: "Bangalore, Pune",
    website: "https://www.ibm.com/careers",
  },
  {
    name: "Accenture",
    role: "Associate Software Engineer",
    ctc: "8 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-05-01"),
    description: "Global professional services company providing consulting and technology services.",
    location: "Bangalore, Mumbai, Chennai",
    website: "https://www.accenture.com/careers",
  },
  {
    name: "Infosys",
    role: "Systems Engineer",
    ctc: "7.5 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-05-05"),
    description: "Indian multinational information technology company providing business consulting and IT services.",
    location: "Bangalore, Mysore, Pune",
    website: "https://www.infosys.com/careers",
  },
  {
    name: "TCS",
    role: "Assistant System Engineer",
    ctc: "7 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-05-10"),
    description: "Tata Consultancy Services - India's largest IT services company.",
    location: "Bangalore, Chennai, Mumbai",
    website: "https://www.tcs.com/careers",
  },
  {
    name: "Wipro",
    role: "Project Engineer",
    ctc: "6.5 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-05-15"),
    description: "Indian multinational corporation providing information technology, consulting and business process services.",
    location: "Bangalore, Pune, Chennai",
    website: "https://careers.wipro.com",
  },
  {
    name: "Cognizant",
    role: "Programmer Analyst",
    ctc: "8 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-05-20"),
    description: "Multinational technology company providing IT services including digital, technology, consulting and operations.",
    location: "Chennai, Bangalore, Coimbatore",
    website: "https://careers.cognizant.com",
  },
  {
    name: "Capgemini",
    role: "Software Engineer",
    ctc: "7.5 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-05-25"),
    description: "French multinational IT services and consulting company.",
    location: "Mumbai, Bangalore, Pune",
    website: "https://www.capgemini.com/careers",
  },
  {
    name: "Intel",
    role: "Software Development Engineer",
    ctc: "21 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-06-01"),
    description: "American multinational corporation and technology company specializing in semiconductor chips.",
    location: "Bangalore, Hyderabad",
    website: "https://www.intel.com/content/www/us/en/jobs",
  },
  {
    name: "Nvidia",
    role: "GPU Software Engineer",
    ctc: "30 LPA",
    eligibility: "CGPA: 8.5+, No backlogs",
    driveDate: new Date("2024-06-05"),
    description: "American multinational technology company designing graphics processing units and AI computing platforms.",
    location: "Bangalore, Pune",
    website: "https://www.nvidia.com/en-us/about-nvidia/careers",
  },
  {
    name: "Salesforce",
    role: "Software Engineer",
    ctc: "23 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-06-10"),
    description: "Cloud-based software company providing customer relationship management services.",
    location: "Hyderabad, Bangalore",
    website: "https://www.salesforce.com/careers",
  },
  {
    name: "Atlassian",
    role: "Software Engineer",
    ctc: "24 LPA",
    eligibility: "CGPA: 7.5+, No backlogs",
    driveDate: new Date("2024-06-15"),
    description: "Australian software company that develops products for software developers and project managers.",
    location: "Bangalore",
    website: "https://www.atlassian.com/company/careers",
  },
  {
    name: "Flipkart",
    role: "Software Development Engineer",
    ctc: "19 LPA",
    eligibility: "CGPA: 7.0+, No backlogs",
    driveDate: new Date("2024-06-20"),
    description: "Indian e-commerce company, one of the largest online marketplaces in India.",
    location: "Bangalore",
    website: "https://www.flipkartcareers.com",
  },
];

const seedData = async () => {
  try {
    console.log("🌱 Starting seed process...");

    // Clear existing data (optional - comment out if you want to keep existing)
    // await Company.deleteMany({});
    // await College.deleteMany({});

    // Seed Colleges
    console.log("📚 Seeding colleges...");
    const createdColleges = await College.insertMany(colleges, {
      ordered: false,
    });
    console.log(`✅ Created ${createdColleges.length} colleges`);

    // Get all colleges to assign to companies
    const allColleges = await College.find();
    if (allColleges.length === 0) {
      console.log("❌ No colleges found. Please seed colleges first.");
      process.exit(1);
    }

    // Seed Companies - assign random colleges
    console.log("🏢 Seeding companies...");
    const companiesWithColleges = companies.map((company) => ({
      ...company,
      college: allColleges[Math.floor(Math.random() * allColleges.length)]._id,
    }));

    const createdCompanies = await Company.insertMany(companiesWithColleges, {
      ordered: false,
    });
    console.log(`✅ Created ${createdCompanies.length} companies`);

    console.log("🎉 Seed process completed successfully!");
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log("⚠️ Some duplicates were skipped");
    } else {
      console.error("❌ Error seeding data:", error);
    }
    process.exit(1);
  }
};

seedData();

